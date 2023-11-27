import { InvalidDataException } from '@devseeder/microservices-exceptions';
import {
  AbstractService,
  MongooseRepository
} from '@devseeder/nestjs-microservices-commons';
import { Relation } from 'src/microservice/domain/interface/relation.interface';
import { SearchEgineOperators } from 'src/microservice/domain/interface/search-engine.interface';
import { AbstractDocument } from 'src/microservice/domain/schemas/abstract.schema';
import { SchemaValidator } from '../../helper/schema-validator.helper';
import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';

export class AbstractDBService<
  Collection,
  MongooseModel,
  ResponseModel,
  SearchParams
> extends AbstractService {
  constructor(
    protected readonly repository: MongooseRepository<
      Collection,
      MongooseModel
    >,
    protected readonly relations: Relation[] = [],
    protected readonly fieldSchema: FieldItemSchema[] = []
  ) {
    super();
  }

  protected async convertRelation(
    item: Partial<MongooseModel> | Partial<AbstractDocument>
  ): Promise<ResponseModel> {
    if (!item) return null;

    const itemResponse = { ...item } as unknown as ResponseModel;
    for await (const rel of this.relations) {
      let value = item[rel.key];

      if (value === undefined) continue;

      if (!Array.isArray(value) && value.split(',').length > 1)
        value = value.split(',');

      if (Array.isArray(value) && value.length) {
        const relPromises = value.map(async (val) => {
          return {
            id: val,
            value: await this.convertValueRelation(rel, val)
          };
        });
        itemResponse[rel.key] = await Promise.all(relPromises);
        continue;
      }

      itemResponse[rel.key] = {
        id: value,
        value: await this.convertValueRelation(rel, value)
      };
    }
    return itemResponse;
  }

  protected async convertValueRelation(
    rel: Relation,
    value: string
  ): Promise<any> {
    if (!value) return null;

    let objValue;
    try {
      objValue = await this[`${rel.service}Service`].getById(value);
    } catch (err) {
      this.logger.error(`Error searching id: ${JSON.stringify(err)}`);
      throw new InvalidDataException(rel.key, value);
    }

    const objKey = rel.repoKey ? rel.repoKey : 'name';

    if (objValue === null || objValue === undefined)
      throw new InvalidDataException(rel.key, value);

    return objValue[objKey];
  }

  protected buildSearchEgines(item: SearchParams): Partial<SearchParams> {
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
    return SchemaValidator.removeUndefined<SearchParams>(
      itemResponse as object
    );
  }

  private buildSearchEgineItem(
    value: any,
    schema: FieldItemSchema,
    operator: SearchEgineOperators,
    itemResponse: SearchParams
  ) {
    if (value === undefined && operator !== SearchEgineOperators.BETWEEN)
      return;

    switch (operator) {
      case SearchEgineOperators.LIKE:
        itemResponse[schema.key] = {
          $regex: new RegExp(`${value}`),
          $options: 'i'
        };
        break;
      case SearchEgineOperators.IN:
        itemResponse[schema.key] = {
          $in: value.split(',')
        };
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
    }
  }
}
