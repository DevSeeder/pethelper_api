import { Injectable, NotAcceptableException } from '@nestjs/common';
import { AbstractDBService } from './abstract-db.service';
import { Search } from '../../dto/search/search.dto';
import { MongoDBException } from '@devseeder/microservices-exceptions';
import { ObjectId } from 'mongoose';
import { GetFieldSchemaService } from '../field-schemas/get-field-schemas.service';
import { AbstractRepository } from 'src/microservice/adapter/repository/abstract.repository';
import { randomUUID } from 'crypto';
import { StringHelper } from '../../helper/string.helper';

@Injectable()
export abstract class AbstractCreateService<
  Collection,
  MongooseModel,
  ResponseModel,
  BodyDto
> extends AbstractDBService<Collection, MongooseModel, ResponseModel, Search> {
  constructor(
    protected readonly repository: AbstractRepository<
      Collection,
      MongooseModel
    >,
    protected readonly itemLabel: string = '',
    protected readonly entityLabels: string[] = [],
    protected readonly getFieldSchemaService?: GetFieldSchemaService
  ) {
    super(repository, entityLabels, itemLabel, getFieldSchemaService);
  }

  async create(body: BodyDto): Promise<{ _id: ObjectId }> {
    await this.convertRelation(body);

    this.logger.log(`Body: ${JSON.stringify(body)}`);

    const bodyCreate = {
      ...body,
      active: true
    };

    try {
      const insertedId = await this.repository.insertOne(
        bodyCreate as Collection,
        this.itemLabel
      );
      return { _id: insertedId };
    } catch (err) {
      if (err instanceof MongoDBException) {
        if (err.errCode === 11000) {
          throw new NotAcceptableException(`${this.itemLabel} already exists`);
        }
      }
    }
  }

  async clone(
    id: string,
    changeUniqueIndex = true,
    relationsToClone = undefined,
    cloneBody = {}
  ): Promise<{ _id: ObjectId }> {
    this.logger.log(`Cloning ${this.itemLabel} '${id}'...`);

    const cloneTarget = await this.validateId(id);

    const bodyCreate = {
      ...cloneTarget,
      active: true
    };

    if (changeUniqueIndex) await this.getUniqueIndexToClone(bodyCreate);

    this.logger.log(`CloneBody ${JSON.stringify({ cloneBody })}`);
    this.logger.log(`Body ${JSON.stringify({ ...bodyCreate, ...cloneBody })}`);

    const insertedId = await this.create({
      ...bodyCreate,
      ...cloneBody
    } as BodyDto);

    await this.cloneRelations(id, insertedId.toString(), relationsToClone);

    return insertedId;
  }

  async cloneByIds(
    ids: string[],
    relationsToClone = undefined,
    cloneBody = {}
  ): Promise<Array<ObjectId>> {
    this.logger.log(`Cloning ${this.itemLabel} '${ids}'...`);
    const arrClone = [];

    for await (const id of ids) {
      const insertedId = await this.clone(
        id,
        true,
        relationsToClone,
        cloneBody
      );
      arrClone.push(insertedId._id);
    }

    return arrClone;
  }

  private async cloneRelations(
    cloneId: string,
    newId: string,
    relationsToClone = undefined
  ): Promise<void> {
    this.logger.log('Cloning relations ');
    const relations = await this.getFieldSchemaService.getExtRelations(
      this.entityLabels[0],
      relationsToClone !== undefined
    );
    this.logger.log(`Cloning ${relations.length} relations`);

    for await (const rel of relations) {
      this.logger.log(`Cloning relation '${rel.externalRelation.service}'...`);
      this.logger.log(
        `Service relation 'get${rel.entity.capitalizeFirstLetter()}Service'...`
      );
      const subItems = await this[
        `get${rel.entity.capitalizeFirstLetter()}Service`
      ].search({
        [rel.key]: cloneId
      });
      this.logger.log(`${subItems.length} itens found for '${rel.entity}'...`);

      for await (const item of subItems) {
        await this[`create${rel.entity.capitalizeFirstLetter()}Service`].clone(
          item._id,
          false,
          '*',
          { [rel.key]: rel.array ? [newId] : newId }
        );
      }
      this.logger.log(
        `Relation '${rel.externalRelation.service}' successfully cloned!`
      );
    }
  }

  private async getUniqueIndexToClone(bodyCreate: MongooseModel) {
    const objIndexes = await this.repository.getIndexes();
    delete objIndexes['_id_'];
    const mapKeys = Object.values(objIndexes).map((key) => key[0][0]);
    const randomId = StringHelper.generateRandomString(7);
    mapKeys.forEach((key) => {
      if (typeof bodyCreate[key] == 'string')
        bodyCreate[key] = `${bodyCreate[key]}(copy ${randomId})`;
    });

    delete bodyCreate['_id'];
    delete bodyCreate['createdAt'];
    delete bodyCreate['updatedAt'];
    delete bodyCreate['inactivationDate'];
  }
}
