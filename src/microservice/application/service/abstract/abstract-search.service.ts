import { InvalidDataException } from '@devseeder/microservices-exceptions';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { SearchEgineOperators } from 'src/microservice/domain/interface/search-engine.interface';
import { SchemaValidator } from '../../helper/schema-validator.helper';
import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';
import { BadRequestException, Inject } from '@nestjs/common';
import { Search } from '../../dto/search/search.dto';
import { FieldSchemaBuilder } from '../../helper/field-schema.builder';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { AbstractDBService } from './abstract-db.service';

export class AbstractSearchService<
  Collection,
  MongooseModel,
  ResponseModel,
  SearchParams extends Search
> extends AbstractDBService<Collection, MongooseModel, ResponseModel> {
  protected fieldSchemaDb: FieldSchema[] = [];
  constructor(
    protected readonly repository: MongooseRepository<
      Collection,
      MongooseModel
    >,
    protected readonly entityLabels: string[] = [],
    protected readonly itemLabel: string = '',
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(repository, entityLabels, itemLabel, fieldSchemaData);
  }

  protected async buildSearchEgines(
    item: SearchParams
  ): Promise<Partial<SearchParams>> {
    if (!item) return null;

    const itemResponse = { ...item };
    const searchEngines = this.fieldSchemaDb.filter(
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
      const isFieldOrder = this.fieldSchemaDb.filter(
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
}
