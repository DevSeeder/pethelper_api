import {
  InvalidDataException,
  NotFoundException
} from '@devseeder/microservices-exceptions';
import {
  AbstractService,
  MongooseRepository
} from '@devseeder/nestjs-microservices-commons';
import { Relation } from 'src/microservice/domain/interface/relation.interface';
import { SearchEgineOperators } from 'src/microservice/domain/interface/search-engine.interface';
import { AbstractDocument } from 'src/microservice/domain/schemas/abstract.schema';
import { SchemaValidator } from '../../helper/schema-validator.helper';
import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';
import { GetFieldSchemaService } from '../configuration/field-schemas/get-field-schemas.service';
import { BadRequestException } from '@nestjs/common';
import { Search } from '../../dto/search/search.dto';
import { VALIDATE_ID_ENUMS } from '../../app.constants';
import { FieldSchemaBuilder } from '../../helper/field-schema.builder';
import { DynamicValueService } from '../dynamic/get-dynamic-value.service';

export class AbstractDBService<
  Collection,
  MongooseModel,
  ResponseModel,
  SearchParams extends Search
> extends AbstractService {
  protected fieldSchema: FieldItemSchema[] = [];
  constructor(
    protected readonly repository: MongooseRepository<
      Collection,
      MongooseModel
    >,
    protected readonly entityLabels: string[] = [],
    protected readonly itemLabel: string = '',
    protected readonly getFieldSchemaService?: GetFieldSchemaService
  ) {
    super();
    this.init();
  }

  async init() {
    if (!this.entityLabels.length || !this.getFieldSchemaService) return;
    try {
      this.logger.log(`Initializing service for '${this.entityLabels[0]}'...`);

      this.fieldSchema = await this.getFieldSchemaService.search(
        this.entityLabels
      );
      this.logger.log(`Service '${this.entityLabels[0]}' finished`);
    } catch (err) {
      this.logger.error(
        `Error loading service for '${this.entityLabels[0]}': ${JSON.stringify(
          err
        )}`
      );
      throw err;
    }
  }

  protected async convertRelation(
    item: Partial<MongooseModel> | Partial<AbstractDocument>
  ): Promise<ResponseModel> {
    if (!item) return null;
    const relations = this.fieldSchema.filter(
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
      objValue = await this[
        `get${rel.service.capitalizeFirstLetter()}Service`
      ].getById(value);
    } catch (err) {
      this.logger.error(`Error searching id: ${JSON.stringify(err)}`);
      throw new InvalidDataException(rel.key, value);
    }

    const objKey = rel.repoKey ? rel.repoKey : 'name';

    if (objValue === null || objValue === undefined)
      throw new InvalidDataException(rel.key, value);

    return objValue[objKey];
  }

  protected async buildSearchEgines(
    item: SearchParams
  ): Promise<Partial<SearchParams>> {
    if (!item) return null;

    const itemResponse = { ...item };
    const searchEngines = this.fieldSchema.filter(
      (schema) => schema.searchEgines && schema.searchEgines.length
    );

    for (const schema of searchEngines) {
      const value = item[schema.key];
      schema.searchEgines.forEach((eng) => {
        this.buildSearchEgineItem(value, schema, eng, itemResponse);
      });
    }

    if (item['_ids']) {
      itemResponse['_id'] = await this.validateIdsSearch(item['_ids']);
      delete itemResponse['_ids'];
    }

    return SchemaValidator.removeUndefined<SearchParams>(
      itemResponse as object
    );
  }

  private async validateIdsSearch(
    idsValue: string
  ): Promise<object | undefined> {
    const ids = idsValue.split(',');

    for await (const id of ids) {
      let res;
      try {
        res = await this.repository.find({ _id: ids }, { name: 1 });
      } catch (err) {
        throw new InvalidDataException('Id', id);
      }
      if (!res.length) throw new InvalidDataException('Id', id);
    }

    return {
      $in: ids
    };
  }

  private buildSearchEgineItem(
    value: any,
    schema: FieldItemSchema,
    operator: SearchEgineOperators,
    itemResponse: SearchParams
  ) {
    if (
      FieldSchemaBuilder.checkUndefinedValue(
        value,
        schema,
        itemResponse,
        operator
      )
    )
      return;

    switch (operator) {
      case SearchEgineOperators.LIKE:
        itemResponse[schema.key] = {
          $regex: new RegExp(`${itemResponse[`${schema.key}_like`]}`),
          $options: 'i'
        };
        delete itemResponse[`${schema.key}_like`];
        break;
      case SearchEgineOperators.IN:
        itemResponse[schema.key] = {
          $in: value.split(',')
        };
        break;

      case SearchEgineOperators.NOT_IN:
        itemResponse[schema.key] = {
          $nin: itemResponse[`${schema.key}_nin`].split(',')
        };
        delete itemResponse[`${schema.key}_nin`];
        break;

      case SearchEgineOperators.BETWEEN:
        const betweenQuery = {};
        if (itemResponse[`${schema.key}_start`])
          betweenQuery['$gte'] = itemResponse[`${schema.key}_start`];
        if (itemResponse[`${schema.key}_end`])
          betweenQuery['$lte'] = itemResponse[`${schema.key}_end`];

        if (Object.keys(betweenQuery).length)
          itemResponse[schema.key] = betweenQuery;

        delete itemResponse[`${schema.key}_start`];
        delete itemResponse[`${schema.key}_end`];
        break;

      default:
        const operatorQuery = {};
        if (itemResponse[`${schema.key}_${operator}`])
          operatorQuery[`$${operator}`] =
            itemResponse[`${schema.key}_${operator}`];

        if (Object.keys(operatorQuery).length)
          itemResponse[schema.key] = operatorQuery;

        delete itemResponse[`${schema.key}_${operator}`];
        break;
    }
  }

  protected validateOrderField(
    item: Partial<SearchParams>,
    orderBy = null,
    orderMode = 1
  ): { sort: object; sortExternal: object; hasExternal: boolean } {
    if (!orderBy) return { sort: {}, sortExternal: {}, hasExternal: false };

    const sortObj = {};
    const sortExternal = {};
    let hasExternal = false;
    const orderKeys = orderBy.split(',');
    orderKeys.forEach((key) => {
      const isFieldOrder = this.fieldSchema.filter(
        (field) => field.key === key.trim() && field.orderBy
      );
      if (!isFieldOrder.length)
        throw new BadRequestException(`Invalid order field '${key.trim()}'`);

      if (isFieldOrder[0].type === 'externalId') {
        hasExternal = true;
        sortExternal[key.trim()] = orderMode;
        return;
      }

      sortObj[key.trim()] = orderMode;
      sortExternal[key.trim()] = orderMode;
    });

    delete item['orderBy'];
    delete item['orderMode'];

    this.logger.log(`Sorting ${JSON.stringify(sortObj)}...`);
    return { sort: sortObj, sortExternal, hasExternal };
  }

  protected async buildSearchParams(
    searchParams: SearchParams
  ): Promise<Partial<SearchParams>> {
    await this.convertRelation(
      searchParams as unknown as Partial<MongooseModel>
    );
    const params = await this.buildSearchEgines(
      this.getDynamicValues(searchParams) as any
    );
    const active = params && params.active !== undefined ? params.active : true;

    return {
      ...params,
      active
    };
  }

  protected async validateId(id: string): Promise<MongooseModel> {
    let item;
    try {
      item = await this.repository.findById(id);
    } catch (err) {
      throw new NotFoundException(this.itemLabel);
    }
    if (!item) throw new NotFoundException(this.itemLabel);
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
