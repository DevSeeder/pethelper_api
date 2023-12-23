import {
  DateHelper,
  MongooseRepository
} from '@devseeder/nestjs-microservices-commons';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { AbstractBodyDto } from '../../dto/body/abtract-body.dto';
import { AbstractSchema } from 'src/microservice/domain/schemas/abstract.schema';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { AbstractSearchService } from './abstract-search.service';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../translation/get-translation.service';
import { ErrorKeys } from 'src/microservice/domain/enum/error-keys.enum';
import { ErrorService } from '../configuration/error-schema/error.service';
import { InactivationReason } from 'src/microservice/domain/enum/inactivation-reason.enum';

@Injectable()
export abstract class AbstractUpdateService<
  Collection,
  MongooseModel extends AbstractSchema,
  ResponseModel,
  BodyDto extends AbstractBodyDto,
  SearchParams
> extends AbstractSearchService<
  Collection,
  MongooseModel,
  ResponseModel,
  SearchParams
> {
  constructor(
    protected readonly repository: MongooseRepository<
      Collection,
      MongooseModel
    >,
    protected readonly entity: string,
    protected readonly fieldSchemaData: FieldSchema[],
    protected readonly entitySchemaData: EntitySchema[],
    protected readonly translationService?: GetTranslationService,
    protected readonly errorService?: ErrorService
  ) {
    super(repository, entity, fieldSchemaData, entitySchemaData);
  }

  async updateById(
    id: string,
    body: Partial<BodyDto> | Partial<AbstractSchema>
  ): Promise<void> {
    if (!body || !Object.keys(body).length)
      this.errorService.throwError(ErrorKeys.EMPTY_BODY);

    this.logger.log(`Updating record by id '${id}'`);

    await this.validateId(id);
    await this.convertRelation(body);

    this.logger.log(`Body: ${JSON.stringify(body)}`);

    await this.repository.updateOneById(id, body);
  }

  async activation(
    id: string,
    activation: boolean,
    cascadeRelations = '',
    reason = InactivationReason.MANUAL
  ): Promise<void> {
    const body: Partial<AbstractSchema> = {
      active: activation,
      inactivationReason: !activation ? reason : null,
      inactivationDate: !activation ? DateHelper.getDateNow() : null
    };

    await this.updateById(id, body);
    if (!cascadeRelations.length) return;

    await this.cascadeUpdate(id, body, !activation, cascadeRelations);
  }

  async cascadeUpdate(
    id: string,
    body: Partial<AbstractSchema>,
    active: boolean,
    cascadeRelations = '*'
  ): Promise<void> {
    const relations = this.entitySchema.subRelations.filter(
      (ent) =>
        cascadeRelations === '*' ||
        (cascadeRelations && cascadeRelations.split(',').includes(ent.entity))
    );

    if (cascadeRelations && cascadeRelations.length && cascadeRelations !== '*')
      cascadeRelations.split(',').forEach((rel) => {
        const foundRelation = this.entitySchema.subRelations.filter(
          (sub) => sub.entity === rel
        );

        if (!foundRelation.length)
          this.errorService.throwError(ErrorKeys.INVALID_DATA, {
            key: 'Relation',
            value: rel
          });
      });

    for await (const rel of relations) {
      this.logger.log(
        `Service relation 'get${rel.entity.capitalizeFirstLetter()}Service'...`
      );
      const data = await this[
        `get${rel.entity.capitalizeFirstLetter()}Service`
      ].search(
        {
          [rel.key]: id,
          active
        },
        false
      );

      const { items: subItems } = data;

      this.logger.log(`${subItems.length} itens found for '${rel.entity}'...`);

      for await (const item of subItems) {
        this.logger.log(`Updating ${item._id} ${JSON.stringify(body)}...`);

        await this[
          `update${rel.entity.capitalizeFirstLetter()}Service`
        ].updateById(item._id, body);
      }
      this.logger.log(`Relation '${rel.service}' successfully updated!`);
    }
  }

  async updateBy(
    search: SearchParams,
    body: Partial<BodyDto> | Partial<AbstractSchema>
  ): Promise<void> {
    if (!body || !Object.keys(body).length)
      this.errorService.throwError(ErrorKeys.EMPTY_BODY);

    this.logger.log(`Updating records by '${JSON.stringify(search)}'`);

    const searchWhere = await this.buildSearchParams(search);

    const items = await this.repository.find(
      searchWhere,
      { name: 1 },
      {},
      false
    );

    if (!items.length) this.errorService.throwError(ErrorKeys.NO_RECORD_UPDATE);

    this.logger.log(`Body: ${JSON.stringify(body)}`);

    await this.convertRelation(body);

    try {
      await this.repository.updateMany(searchWhere, body);
    } catch (err) {
      this.errorService.throwError(ErrorKeys.ALREADY_UPDATED);
    }
  }
}
