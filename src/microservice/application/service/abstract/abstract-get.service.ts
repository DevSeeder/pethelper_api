import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { Relation } from '../../../domain/interface/relation.interface';
import {
  SearchEgineOperators,
  SearchEngine
} from 'src/microservice/domain/interface/search-engine.interface';
import { SchemaValidator } from '../../helper/schema-validator.helper';
import { AbstractDBService } from './abstract-db.service';

@Injectable()
export abstract class AbstractGetService<
  Collection,
  MongooseModel,
  ResponseModel,
  SearchParams extends Search
> extends AbstractDBService<
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
    protected readonly itemLabel: string = '',
    protected readonly relations: Relation[] = [],
    protected readonly searchEngines: SearchEngine[] = []
  ) {
    super(repository, relations);
  }

  async search(searchParams: SearchParams = null): Promise<ResponseModel[]> {
    await this.convertRelation(
      searchParams as unknown as Partial<MongooseModel>
    );
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
}
