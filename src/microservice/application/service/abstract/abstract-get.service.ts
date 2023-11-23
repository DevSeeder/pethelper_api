import {
  AbstractService,
  MongooseRepository
} from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { Relation } from '../../../domain/interface/relation.interface';
import { InvalidDataException } from '@devseeder/microservices-exceptions';
import { AbstractTransformation } from '../../transform/abstract.transformation';
import {
  SearchEgineOperators,
  SearchEngine
} from 'src/microservice/domain/interface/search-engine.interface';
import { SchemaValidator } from '../../helper/schema-validator.helper';

@Injectable()
export abstract class AbstractGetService<
  Collection,
  MongooseModel,
  ResponseModel,
  SearchParams extends Search
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

  async search(searchParams: SearchParams = null): Promise<ResponseModel[]> {
    await this.convertRelation(searchParams);
    const params = this.buildSearchEgines(searchParams);

    const active = params && params.active !== undefined ? params.active : true;
    const searchWhere = { ...params, active };
    this.logger.log(`Searching ${JSON.stringify(searchWhere)}...`);
    const responseItems = await this.repository.find(
      searchWhere,
      { all: 0 },
      {},
      false
    );
    const arrMap = await responseItems.map((item) =>
      this.convertRelation(item)
    );
    return Promise.all(arrMap);
  }

  async getById(id: string): Promise<ResponseModel> {
    const item = await this.repository.findById(id, { all: 0 });
    return this.convertRelation(item);
  }

  private async convertRelation(
    item: MongooseModel | SearchParams
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

  private async convertValueRelation(
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

  private buildSearchEgines(item: SearchParams): Partial<SearchParams> {
    if (!item) return null;

    const itemResponse = { ...item } as unknown as any;
    for (const rel of this.searchEngines) {
      const value = item[rel.key];

      if (value === undefined) continue;

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
      }
    }
    const rem = SchemaValidator.removeUndefined<SearchParams>(itemResponse);
    console.log('rem');
    console.log(rem);

    return rem;
  }
}
