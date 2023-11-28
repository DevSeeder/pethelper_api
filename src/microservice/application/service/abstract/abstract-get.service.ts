import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { AbstractDBService } from './abstract-db.service';
import { GetFieldSchemaService } from '../field-schemas/get-field-schemas.service';
import { FieldSchemaResponse } from 'src/microservice/domain/interface/field-schema.interface';
import { FieldSchemaBuilder } from '../../helper/field-schema.builder';

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

  async search(
    searchParams: SearchParams = null,
    select = {}
  ): Promise<ResponseModel[]> {
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
      select ? select : { all: 0 },
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

  async getForm(page: string): Promise<FieldSchemaResponse> {
    const fields = this.fieldSchema.filter((field) =>
      FieldSchemaBuilder.getFormFilterCondition(page, field)
    );

    const arrayResponse = [];

    for await (const field of fields) {
      const objectItem = { ...field };

      if (field.type === 'externalId' && !field.hidden)
        objectItem['values'] = await this[
          `${field.externalRelation.service}Service`
        ].search({ pageSize: 50 }, { _id: 1, name: 1 });

      arrayResponse.push(objectItem);
    }

    return {
      fields: arrayResponse
    };
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
