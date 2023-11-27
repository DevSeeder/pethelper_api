import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { AbstractDBService } from './abstract-db.service';
import { GetFieldSchemaService } from '../field-schemas/get-field-schemas.service';

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
    protected readonly entityLabels: string[] = [],
    @Inject(forwardRef(() => GetFieldSchemaService))
    protected readonly getFieldSchemaService?: GetFieldSchemaService
  ) {
    super(repository, entityLabels, getFieldSchemaService);
  }

  async search(searchParams: SearchParams = null): Promise<ResponseModel[]> {
    await this.convertRelation(
      searchParams as unknown as Partial<MongooseModel>
    );
    const params = this.buildSearchEgines(searchParams);

    const active = params && params.active !== undefined ? params.active : true;
    const searchWhere = { ...params, active };
    const { page, pageSize } = this.getPagination(searchParams, searchWhere);

    this.logger.log(
      `Searching '${this.itemLabel}' ${JSON.stringify(searchWhere)}...`
    );
    this.logger.log(`Pagination ${JSON.stringify({ page, pageSize })}...`);
    const responseItems = await this.repository.find(
      searchWhere,
      { all: 0 },
      {},
      false,
      pageSize,
      page
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

  private getPagination(
    search: SearchParams = null,
    searchWhere: Partial<SearchParams>
  ): {
    pageSize: number;
    page: number;
  } {
    if (!search) return { page: 0, pageSize: 0 };

    delete searchWhere.page;
    delete searchWhere.pageSize;

    const limit = search?.pageSize | 0;

    return {
      pageSize: search?.pageSize | 0,
      page: limit && search?.page ? search.page * limit : 0
    };
  }
}
