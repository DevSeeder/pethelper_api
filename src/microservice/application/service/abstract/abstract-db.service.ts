import { InvalidDataException } from '@devseeder/microservices-exceptions';
import {
  AbstractService,
  MongooseRepository
} from '@devseeder/nestjs-microservices-commons';
import { Relation } from 'src/microservice/domain/interface/relation.interface';
import {
  SearchEgineOperators,
  SearchEngine
} from 'src/microservice/domain/interface/search-engine.interface';
import { AbstractDocument } from 'src/microservice/domain/schemas/abstract.schema';
import { SchemaValidator } from '../../helper/schema-validator.helper';

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
    protected readonly searchEngines: SearchEngine[] = []
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
      this.logger.log(`Calling getById(${value}) from '${rel.service}Service'`);
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

    const itemResponse = { ...item } as unknown as any;
    for (const rel of this.searchEngines) {
      const value = item[rel.key];

      if (value === undefined && rel.operator !== SearchEgineOperators.BETWEEN)
        continue;

      switch (rel.operator) {
        case SearchEgineOperators.LIKE:
          itemResponse[rel.key] = {
            $regex: new RegExp(`${value}`),
            $options: 'i'
          };
          break;
        case SearchEgineOperators.IN:
          itemResponse[rel.key] = {
            $in: value.split(',')
          };
          break;

        case SearchEgineOperators.BETWEEN:
          const betweenQuery = {};
          if (item[`${rel.key}_start`])
            betweenQuery['$gte'] = item[`${rel.key}_start`];
          if (item[`${rel.key}_end`])
            betweenQuery['$lte'] = item[`${rel.key}_end`];

          if (Object.keys(betweenQuery).length)
            itemResponse[rel.key] = betweenQuery;

          delete itemResponse[`${rel.key}_start`];
          delete itemResponse[`${rel.key}_end`];
          break;
      }
    }
    return SchemaValidator.removeUndefined<SearchParams>(itemResponse);
  }
}
