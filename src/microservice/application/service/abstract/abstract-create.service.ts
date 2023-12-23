import { Injectable } from '@nestjs/common';
import { AbstractDBService } from './abstract-db.service';
import { MongoDBException } from '@devseeder/microservices-exceptions';
import { ObjectId } from 'mongoose';
import { AbstractRepository } from 'src/microservice/adapter/repository/abstract.repository';
import { StringHelper } from '../../helper/types/string.helper';
import {
  CloneManyResponse,
  CloneOneResponse
} from '../../dto/response/clone.response';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../translation/get-translation.service';
import { ErrorKeys } from 'src/microservice/domain/enum/error-keys.enum';
import { ErrorService } from '../configuration/error-schema/error.service';
import { RollbackCloneService } from '../rollback/rollback-clone.service';
import { AbstractSchema } from 'src/microservice/domain/schemas/abstract.schema';
import { AbstractUpdateService } from './abstract-update.service';
import { Search } from '@devseeder/nestjs-microservices-commons';

@Injectable()
export abstract class AbstractCreateService<
  Collection,
  MongooseModel extends AbstractSchema,
  ResponseModel,
  BodyDto
> extends AbstractDBService<Collection, MongooseModel, ResponseModel> {
  protected readonly rollbackService: RollbackCloneService<
    Collection,
    MongooseModel,
    ResponseModel,
    BodyDto
  >;

  constructor(
    protected readonly repository: AbstractRepository<
      Collection,
      MongooseModel
    >,
    protected readonly entity: string,
    protected readonly updateService: AbstractUpdateService<
      Collection,
      MongooseModel,
      ResponseModel,
      BodyDto,
      Search
    >,
    protected readonly fieldSchemaData: FieldSchema[],
    protected readonly entitySchemaData: EntitySchema[],
    protected readonly translationService?: GetTranslationService,
    protected readonly errorService?: ErrorService
  ) {
    super(repository, entity, fieldSchemaData, entitySchemaData);

    this.rollbackService = new RollbackCloneService(updateService, this.entity);
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
          const entityTranslation =
            await this.translationService.getEntityTranslation(
              this.entitySchema.entity
            );

          this.errorService.throwError(ErrorKeys.ALREADY_EXISTS, {
            key: entityTranslation.itemLabel,
            value: body['name']
          });
        }
      }
    }
  }

  async clone(
    id: string,
    changeUniqueIndex = true,
    relationsToClone = [],
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

    try {
      await this.cloneRelations(
        id,
        insertedId._id.toString(),
        relationsToClone
      );
    } catch (err) {
      await this.rollbackService.rollbackClone(insertedId._id.toString());
      throw err;
    }

    return insertedId;
  }

  async cloneByIds(
    ids: string[],
    relationsToClone = [],
    cloneBody = {}
  ): Promise<CloneManyResponse> {
    this.logger.log(`Cloning ${this.entitySchema.itemLabel} '${ids}'...`);
    const arrClone: ObjectId[] = [];

    try {
      for await (const id of ids) {
        const insertedId = await this.clone(
          id,
          true,
          relationsToClone,
          cloneBody
        );
        arrClone.push(insertedId._id);
      }
    } catch (err) {
      this.logger.error(
        `Error while clonning, starting rollback for all itens`
      );
      for await (const cloneId of arrClone) {
        await this.rollbackService.rollbackClone(cloneId.toString());
      }
      this.logger.error('Rollback finished for all itens');
      throw err;
    }

    return { _ids: arrClone };
  }

  private async cloneRelations(
    cloneId: string,
    newId: string,
    relationsToClone = []
  ): Promise<void> {
    this.logger.log('Cloning relations ');
    const relations = this.entitySchema.subRelations.filter((sub) =>
      relationsToClone.length
        ? (relationsToClone.includes(sub.entity) ||
            relationsToClone[0] === '*') &&
          sub.clone
        : false
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

    [...mapKeys, ...(this.entitySchema.copyFields || [])].forEach((key) => {
      if (typeof bodyCreate[key] == 'string')
        bodyCreate[key] = `${bodyCreate[key]}(copy ${randomId})`;
    });

    delete bodyCreate['_id'];
    delete bodyCreate['createdAt'];
    delete bodyCreate['updatedAt'];
    delete bodyCreate['inactivationDate'];
  }
}
