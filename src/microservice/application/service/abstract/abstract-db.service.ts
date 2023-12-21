import {
  InvalidDataException,
  NotFoundException
} from '@devseeder/microservices-exceptions';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Relation } from 'src/microservice/domain/interface/relation.interface';
import { SearchEgineOperators } from 'src/microservice/domain/interface/search-engine.interface';
import { AbstractDocument } from 'src/microservice/domain/schemas/abstract.schema';
import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';
import {
  DEFAULT_LANG,
  GLOBAL_ENTITY,
  VALIDATE_ID_ENUMS
} from '../../app.constants';
import { DynamicValueService } from '../dynamic/get-dynamic-value.service';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { AbstractEntityLoader } from '../../loader/abstract-entity.loader';
import { GetTranslationService } from '../translation/get-translation.service';

export class AbstractDBService<
  Collection,
  MongooseModel,
  ResponseModel
> extends AbstractEntityLoader {
  constructor(
    protected readonly repository: MongooseRepository<
      Collection,
      MongooseModel
    >,
    protected readonly entity: string,
    protected readonly fieldSchemaData: FieldSchema[] = [],
    protected readonly entitySchemaData: EntitySchema[] = [],
    protected readonly translationService?: GetTranslationService
  ) {
    super(entity, fieldSchemaData, entitySchemaData);
  }

  protected async convertRelation(
    item: Partial<MongooseModel> | Partial<AbstractDocument>
  ): Promise<ResponseModel> {
    if (!item) return null;
    const relations = this.fieldSchemaDb.filter(
      (schema) => schema.type === 'externalId'
    );
    const itemResponse = { ...item } as unknown as ResponseModel;
    for await (const schema of relations) {
      await this.convertRelationItem(schema, item, itemResponse);
    }
    return this.getDynamicValues(itemResponse) as ResponseModel;
  }

  private async convertRelationItem(
    schema: FieldItemSchema,
    item: Partial<MongooseModel> | Partial<AbstractDocument>,
    itemResponse: ResponseModel
  ) {
    const rel: Relation = {
      key: schema.key,
      service: schema.externalRelation.service
    };

    let keys: Array<SearchEgineOperators | ''> = [''];

    if (
      schema.searchEgines &&
      schema.searchEgines.find((op) =>
        Object.values(VALIDATE_ID_ENUMS).includes(op)
      )
    ) {
      keys = ['', ...Object.values(VALIDATE_ID_ENUMS)];
    }

    const value = item[rel.key];
    let isNormalValidation = true;
    for await (const key of keys) {
      const validationRes = await this.validateOperatorFields(
        key.length ? `${rel.key}_${key}` : rel.key,
        item,
        itemResponse,
        rel,
        key
      );

      if (!validationRes) isNormalValidation = false;
    }

    if (!isNormalValidation || value === undefined) return;

    itemResponse[rel.key] = {
      id: value,
      value: await this.convertValueRelation(rel, value)
    };
  }

  private async validateOperatorFields(
    key: string,
    item: Partial<MongooseModel> | Partial<AbstractDocument>,
    itemResponse: ResponseModel,
    relation: Relation,
    operator: SearchEgineOperators | ''
  ): Promise<boolean> {
    let value = item[key];

    if (value === undefined) return true;

    if (!Array.isArray(value) && value.split(',').length > 1)
      value = value.split(',');

    if (Array.isArray(value) && value.length) {
      const relPromises = value.map(async (val) => {
        return {
          id: val,
          value: await this.convertValueRelation(relation, val)
        };
      });

      itemResponse[key] = await Promise.all(relPromises);
      return false;
    }

    if (
      operator !== '' &&
      Object.values(VALIDATE_ID_ENUMS).includes(operator)
    ) {
      await this.convertValueRelation(relation, value);
      return false;
    }
    return true;
  }

  protected async convertValueRelation(
    rel: Relation,
    value: string
  ): Promise<any> {
    if (!value) return null;

    let objValue;
    try {
      const serviceKey = `get${rel.service.capitalizeFirstLetter()}Service`;
      objValue = await this[serviceKey].getById(value);
    } catch (err) {
      this.logger.error(`Error searching id: ${JSON.stringify(err)}`);
      this.logger.error(err);
      throw new InvalidDataException(rel.key, value);
    }

    const objKey = rel.repoKey ? rel.repoKey : 'name';

    if (objValue === null || objValue === undefined)
      throw new InvalidDataException(rel.key, value);

    let valueRelation = objValue[objKey];

    if (objValue.translations && objValue.translations.length) {
      const lang = this.translationService.getLang();
      const translation = objValue.translations.filter(
        (tra) => tra.locale == lang
      );
      valueRelation = translation[0].value;
    }

    return valueRelation;
  }

  protected async validateId(id: string): Promise<MongooseModel> {
    let item;
    const entityTranslation =
      await this.translationService.getEntityTranslation(
        this.entitySchema.entity
      );

    try {
      item = await this.repository.findById(id);
    } catch (err) {
      throw new NotFoundException(entityTranslation.itemLabel);
    }
    if (!item) throw new NotFoundException(entityTranslation.itemLabel);
    return item;
  }

  protected getDynamicValues(
    item: Partial<MongooseModel> | Partial<AbstractDocument>
  ): Partial<MongooseModel> | Partial<AbstractDocument> {
    Object.keys(item)
      .filter(
        (key) =>
          typeof item[key] == 'string' &&
          (item[key].startsWith('@') || item[key].startsWith('$'))
      )
      .forEach((key) => {
        item[key] = DynamicValueService.getDynamicValue(
          item[key],
          item[key],
          item
        );
      });
    return item;
  }
}
