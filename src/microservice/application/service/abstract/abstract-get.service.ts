import { Injectable, BadRequestException } from '@nestjs/common';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import {
  FieldSchemaPage,
  FormSchemaResponse
} from 'src/microservice/domain/interface/field-schema.interface';
import { FieldSchemaBuilder } from '../../helper/validator/field-schema.builder';
import { SortHelper } from '../../helper/search/sort.helper';
import { AbstractRepository } from 'src/microservice/adapter/repository/abstract.repository';
import {
  CountResponse,
  PaginatedMeta,
  PaginatedResponse
} from '../../dto/response/paginated.response';
import { InvalidDataException } from '@devseeder/microservices-exceptions';
import { GroupByResponse } from '../../dto/response/groupby/group-by.response';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { AbstractSearchService } from './abstract-search.service';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';

@Injectable()
export abstract class AbstractGetService<
  Collection,
  MongooseModel,
  ResponseModel,
  SearchParams extends Search
> extends AbstractSearchService<
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
    protected readonly entity: string,
    protected readonly fieldSchemaData?: FieldSchema[],
    protected readonly entitySchemaData?: EntitySchema[]
  ) {
    super(repository, entity, fieldSchemaData, entitySchemaData);
  }

  async search(
    searchParams: SearchParams = null,
    paginate = true
  ): Promise<PaginatedResponse<ResponseModel>> {
    const searchWhere = await this.buildSearchParams(searchParams);
    const { page, pageSize } = this.getPagination(searchParams, searchWhere);
    const { sort, sortExternal, hasExternal } = this.validateOrderField(
      searchWhere,
      searchParams?.orderBy,
      searchParams?.orderMode | 1
    );

    this.logger.log(
      `Searching '${this.entitySchema.itemLabel}' ${JSON.stringify(
        searchWhere
      )}...`
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

    const totalSorted = SortHelper.orderBy(
      await Promise.all(arrMap),
      this.fieldSchemaDb,
      sortExternal,
      hasExternal
    );

    const response = {
      items: totalSorted
    };
    if (paginate)
      response['meta'] = await this.getPaginatedResponse(
        totalSorted,
        searchWhere,
        searchParams.page,
        pageSize
      );
    return response;
  }

  async getById(id: string): Promise<ResponseModel> {
    let item;
    try {
      item = await this.repository.findById(id, { all: 0 });
    } catch (err) {
      throw new InvalidDataException('Id', id);
    }
    return this.convertRelation(item);
  }

  async getForm(page: string): Promise<FormSchemaResponse> {
    const fields = this.fieldSchemaDb.filter((field) =>
      FieldSchemaBuilder.getFormFilterCondition(page, field)
    );
    const orderFields = this.fieldSchemaDb.filter((fields) => fields.orderBy);
    const arrayResponse = [];

    for await (const field of fields) {
      const objectItem = { ...field };

      if (field.type === 'externalId' && !field.hidden) {
        const values = await this[
          `get${field.externalRelation.service.capitalizeFirstLetter()}Service`
        ].search({ pageSize: 50, select: 'name' });
        objectItem['values'] = values.data;
      }

      arrayResponse.push(objectItem);
    }

    const cloneRelations = this.entitySchema.subRelations.filter(
      (sub) => sub.clone
    );

    const response: FormSchemaResponse = {
      fields: arrayResponse,
      cloneRelations: cloneRelations.map((rel) => ({
        relation: rel.entity,
        label: rel.label
      })),
      entityRefs: {
        entity: this.entitySchema.entity,
        label: this.entitySchema.label,
        forbiddenMethods: this.entitySchema.forbiddenMethods
      }
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
    const curPage = search?.page <= 1 ? 0 : search?.page;

    const returnPagination = {
      pageSize: search?.pageSize | 0,
      page: limit && curPage ? (curPage - 1) * limit + 1 : 0
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
      if (!this.fieldSchemaDb.find((schema) => schema.key === key))
        throw new BadRequestException(`Invalid select field '${key}'`);
      selectParam[key] = 1;
    });

    return { ...selectParam, _id: 1 };
  }

  private async getPaginatedResponse(
    items: ResponseModel[],
    searchWhere: object,
    page: number,
    pageSize: number
  ): Promise<PaginatedMeta> {
    const count = await this.repository.count(searchWhere);
    const hasNextPage = (page - 1) * pageSize + items.length < count;
    const currentPage = page ? Number(page) : 1;
    return {
      currentPage,
      nextPage: hasNextPage ? currentPage + 1 : currentPage,
      hasNext: hasNextPage,
      pageRecords: items.length,
      totalRecords: count,
      actualIndex: items.length ? (page - 1) * pageSize + items.length : 0,
      numberOfPages: Math.ceil(count / pageSize)
    };
  }

  async count(searchParams: SearchParams): Promise<CountResponse> {
    const searchWhere = await this.buildSearchParams(searchParams);
    this.logger.log(
      `Counting '${this.entitySchema.itemLabel}' for: ${JSON.stringify(
        searchWhere
      )}`
    );
    return {
      totalRecords: await this.repository.count(searchWhere)
    };
  }

  async groupBy(
    groupedEntity: string,
    searchParams: SearchParams = null
  ): Promise<GroupByResponse[]> {
    const sumField = searchParams['sumField'];
    delete searchParams['sumField'];

    const rel = this.fieldSchemaDb.filter(
      (schema) =>
        schema.externalRelation &&
        schema.externalRelation.service === groupedEntity
    );

    const sumFieldSchema = this.fieldSchemaDb.filter(
      (schema) =>
        schema.key === sumField &&
        ['number', 'double', 'integer'].includes(schema.type)
    );
    if (sumField && !sumFieldSchema.length)
      throw new InvalidDataException('Sum Field', sumField);

    if (!rel.length) throw new InvalidDataException('Relation', groupedEntity);

    const searchWhere = await this.buildSearchParams(searchParams);

    const aggResponse = await this.repository.groupBy(
      searchWhere,
      rel[0].externalRelation.service,
      rel[0].key,
      sumField,
      rel[0].array
    );

    const arrResponse: any[] = [];

    for await (const agg of aggResponse) {
      if (!agg._id || !agg._id.length) continue;

      const responseObj = {};
      responseObj[`${rel[0].key}`] = {
        id: agg._id[0],
        value: agg.name[0]
      };
      arrResponse.push({
        ...responseObj,
        groupResult: {
          totalSum: sumField
            ? agg[`total${sumField.capitalizeFirstLetter()}`]
            : undefined,
          avg: sumField
            ? agg[`avg${sumField.capitalizeFirstLetter()}`]
            : undefined,
          count: agg.count
        }
      });
    }

    return arrResponse;
  }
}
