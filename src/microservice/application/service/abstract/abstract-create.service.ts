import { Injectable, NotAcceptableException } from '@nestjs/common';
import { AbstractDBService } from './abstract-db.service';
import { MongoDBException } from '@devseeder/microservices-exceptions';
import { ObjectId } from 'mongoose';
import { AbstractRepository } from 'src/microservice/adapter/repository/abstract.repository';
import { StringHelper } from '../../helper/string.helper';
import {
  CloneManyResponse,
  CloneOneResponse
} from '../../dto/response/clone.response';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';

@Injectable()
export abstract class AbstractCreateService<
  Collection,
  MongooseModel,
  ResponseModel,
  BodyDto
> extends AbstractDBService<Collection, MongooseModel, ResponseModel> {
  constructor(
    protected readonly repository: AbstractRepository<
      Collection,
      MongooseModel
    >,
    protected readonly entity: string,
    protected readonly fieldSchemaData?: FieldSchema[],
    protected readonly entitySchemaData?: EntitySchema[]
  ) {
    super(repository, entity, fieldSchemaData, entitySchemaData);
  }

  async create(body: BodyDto): Promise<{ _id: ObjectId }> {
    await this.convertRelation(body);

    const bodyCreate = {
      ...this.getDynamicValues(body),
      active: true
    };

    this.logger.log(`Body: ${JSON.stringify(bodyCreate)}`);

    try {
      const insertedId = await this.repository.insertOne(
        bodyCreate as Collection,
        this.entitySchema.itemLabel
      );
      return { _id: insertedId };
    } catch (err) {
      if (err instanceof MongoDBException) {
        if (err.errCode === 11000) {
          throw new NotAcceptableException(
            `${this.entitySchema.itemLabel} already exists`
          );
        }
      }
    }
  }

  async clone(
    id: string,
    changeUniqueIndex = true,
    relationsToClone = undefined,
    cloneBody = {}
  ): Promise<CloneOneResponse> {
    this.logger.log(`Cloning ${this.entitySchema.itemLabel} '${id}'...`);

    const cloneTarget = await this.validateId(id);

    const bodyCreate = {
      ...cloneTarget,
      active: true
    };

    if (changeUniqueIndex) await this.getUniqueIndexToClone(bodyCreate);

    this.logger.log(`CloneBody ${JSON.stringify(cloneBody)}`);
    this.logger.log(`Body ${JSON.stringify({ ...bodyCreate, ...cloneBody })}`);

    const insertedId = await this.create({
      ...bodyCreate,
      ...cloneBody
    } as BodyDto);

    await this.cloneRelations(id, insertedId._id.toString(), relationsToClone);

    return insertedId;
  }

  async cloneByIds(
    ids: string[],
    relationsToClone = undefined,
    cloneBody = {}
  ): Promise<CloneManyResponse> {
    this.logger.log(`Cloning ${this.entitySchema.itemLabel} '${ids}'...`);
    const arrClone: ObjectId[] = [];

    for await (const id of ids) {
      const insertedId = await this.clone(
        id,
        true,
        relationsToClone,
        cloneBody
      );
      arrClone.push(insertedId._id);
    }

    return { _ids: arrClone };
  }

  private async cloneRelations(
    cloneId: string,
    newId: string,
    relationsToClone = undefined
  ): Promise<void> {
    this.logger.log('Cloning relations ');
    const relations = this.entitySchema.subRelations.filter((sub) =>
      relationsToClone ? sub.clone : true
    );
    this.logger.log(`Cloning ${relations.length} relations`);
    for await (const rel of relations) {
      this.logger.log(`Cloning relation '${rel.service}'...`);
      this.logger.log(
        `Service relation 'get${rel.entity.capitalizeFirstLetter()}Service'...`
      );
      const data = await this[
        `get${rel.entity.capitalizeFirstLetter()}Service`
      ].search(
        {
          [rel.key]: cloneId
        },
        false
      );

      const { items: subItems } = data;

      this.logger.log(`${subItems.length} itens found for '${rel.entity}'...`);

      for await (const item of subItems) {
        await this[`create${rel.entity.capitalizeFirstLetter()}Service`].clone(
          item._id,
          false,
          '*',
          { [rel.key]: rel.array ? [newId] : newId }
        );
      }
      this.logger.log(`Relation '${rel.service}' successfully cloned!`);
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
