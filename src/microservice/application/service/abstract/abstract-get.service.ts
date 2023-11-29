import {
  Injectable,
  forwardRef,
  Inject,
  BadRequestException
} from '@nestjs/common';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { AbstractDBService } from './abstract-db.service';
import { GetFieldSchemaService } from '../field-schemas/get-field-schemas.service';
import {
  FieldSchemaPage,
  FieldSchemaResponse
} from 'src/microservice/domain/interface/field-schema.interface';
import { FieldSchemaBuilder } from '../../helper/field-schema.builder';
import { SortHelper } from '../../helper/sort.helper';
import { AbstractRepository } from 'src/microservice/adapter/repository/abstract.repository';

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
    protected readonly repository: AbstractRepository<
      Collection,
      MongooseModel
    >,
    protected readonly itemLabel: string = '',
    protected readonly entityLabels: string[] = [],
    @Inject(forwardRef(() => GetFieldSchemaService))
    protected readonly getFieldSchemaService?: GetFieldSchemaService
  ) {
    super(repository, entityLabels, itemLabel, getFieldSchemaService);
  }

  async search(searchParams: SearchParams = null): Promise<ResponseModel[]> {
    const searchWhere = await this.buildSearchParams(searchParams);
    const { page, pageSize } = this.getPagination(searchParams, searchWhere);
    const { sort, sortExternal, hasExternal } = this.validateOrderField(
      searchWhere,
      searchParams?.orderBy,
      searchParams?.orderMode | 1
    );

    console.log(await this.repository.getIndexes());

    this.logger.log(
      `Searching '${this.itemLabel}' ${JSON.stringify(searchWhere)}...`
    );
    const responseItems = await this.repository.find(
      searchWhere,
      this.getSelectFields(searchParams),
      sort,
      false,
      pageSize,
      page
    );

    const arrMap = await responseItems.map((item) =>
      this.convertRelation(item)
    );
    return SortHelper.orderBy(
      await Promise.all(arrMap),
      this.fieldSchema,
      sortExternal,
      hasExternal
    );
  }

  async getById(id: string): Promise<ResponseModel> {
    const item = await this.repository.findById(id, { all: 0 });
    return this.convertRelation(item);
  }

  async getForm(page: string): Promise<FieldSchemaResponse> {
    const fields = this.fieldSchema.filter((field) =>
      FieldSchemaBuilder.getFormFilterCondition(page, field)
    );
    const orderFields = this.fieldSchema.filter((fields) => fields.orderBy);
    const arrayResponse = [];

    for await (const field of fields) {
      const objectItem = { ...field };

      if (field.type === 'externalId' && !field.hidden)
        objectItem['values'] = await this[
          `${field.externalRelation.service}Service`
        ].search({ pageSize: 50, select: 'name' });

      arrayResponse.push(objectItem);
    }

    const response: FieldSchemaResponse = {
      fields: arrayResponse
    };

    if (page === FieldSchemaPage.SEARCH)
      response.filterOptions = {
        orderBy: orderFields.map((field) => ({
          key: field.key,
          label: field.label
        }))
      };

    return response;
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

    const returnPagination = {
      pageSize: search?.pageSize | 0,
      page: limit && search?.page ? search.page * limit : 0
    };
    this.logger.log(`Pagination ${JSON.stringify(returnPagination)}...`);
    return returnPagination;
  }

  private getSelectFields(params: Partial<SearchParams>): {
    [key: string]: number;
  } {
    if (!params.select) return { all: 0 };

    const selectParam = {};
    params.select.split(',').forEach((key) => {
      if (!this.fieldSchema.find((schema) => schema.key === key))
        throw new BadRequestException(`Invalid select field '${key}'`);
      selectParam[key] = 1;
    });

    return { ...selectParam, _id: 1 };
  }
}
