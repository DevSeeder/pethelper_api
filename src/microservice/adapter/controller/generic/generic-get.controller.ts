import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { GenericGetService } from 'src/microservice/application/service/abstract/generic-get.service';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { AbstractGetController } from '../abstract/abstract-get.controller';
import { GroupByResponse } from 'src/microservice/application/dto/response/groupby/group-by.response';
import { FormSchemaResponse } from 'src/microservice/domain/interface/field-schema.interface';
import {
  CountResponse,
  PaginatedResponse
} from 'src/microservice/application/dto/response/paginated.response';
import { ErrorKeys } from 'src/microservice/domain/enum/error-keys.enum';
import { MyJwtAuthGuard } from 'src/core/auth/jwt.auth';
import { Scopes } from '@devseeder/nestjs-microservices-core';
import { buildControllerScopes } from './generic.controller';
import { MetaScope } from 'src/core/auth/meta-scope/meta-scope.decorator';
import { MetaDataInterceptor } from 'src/core/interceptor/execution-context.interceptor';

const allKey = 'GET';

export function GenericGetController<
  Collection,
  GetResponse,
  SearchParams,
  BodyDto
>({ entity }: { entity: string }) {
  @UseInterceptors(MetaDataInterceptor)
  @Controller(entity.toLowerCase())
  class GenericGetControllerHost extends AbstractGetController<
    Collection,
    GetResponse,
    SearchParams,
    BodyDto
  > {
    constructor(
      @Inject(`GENERIC_GET_SERVICE_${entity}`)
      readonly getService?: GenericGetService<
        Collection,
        GetResponse,
        SearchParams
      >,
      @Inject(DependecyTokens.FIELD_SCHEMA_DB)
      readonly fieldSchemaData?: FieldSchema[],
      @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
      readonly entitySchemaData?: EntitySchema[],
      readonly errorService?: ErrorService,
      readonly translationService?: GetTranslationService
    ) {
      super(
        entity,
        getService,
        fieldSchemaData,
        entitySchemaData,
        errorService,
        translationService
      );
    }

    @UseGuards(MyJwtAuthGuard)
    @MetaScope({ entity, accessKey: 'GET_BY_ID' })
    @Get(`/:id`)
    async getById(@Param('id') id: string): Promise<GetResponse> {
      return this.getService.getById(id, true);
    }

    @UseGuards(MyJwtAuthGuard)
    @MetaScope({ entity, accessKey: 'SEARCH_BY_ID' })
    @Get(`/search/:searchId`)
    async searchBy(
      @Query() params: SearchParams,
      @Param('searchId') searchId: string
    ): Promise<PaginatedResponse<GetResponse>> {
      this.isMethodAllowed('searchBy');

      if (params[this.entitySchema.searchKey] !== undefined)
        this.errorService.throwError(ErrorKeys.NOT_ALLOWED, {
          key: this.entitySchema.searchKey
        });

      await this.schemaValidator.validateRequestSchema(
        this.requestSchema,
        'search',
        params,
        [],
        true
      );

      if (this.entitySchema.searchKey)
        params[this.entitySchema.searchKey] = searchId;

      return this.getService.search(params);
    }

    @UseGuards(MyJwtAuthGuard)
    @MetaScope({ entity, accessKey: 'SEARCH_ALL' })
    @Get(`/`)
    async searchAll(
      @Query() params: SearchParams
    ): Promise<PaginatedResponse<GetResponse>> {
      await this.schemaValidator.validateRequestSchema(
        this.requestSchema,
        'search',
        params,
        [],
        true
      );
      return this.getService.search(params);
    }

    @UseGuards(MyJwtAuthGuard)
    @MetaScope({ entity, accessKey: 'COUNT' })
    @Get(`/meta/count`)
    async count(@Query() params: SearchParams): Promise<CountResponse> {
      await this.schemaValidator.validateRequestSchema(
        this.requestSchema,
        'count',
        params,
        [],
        true
      );
      return this.getService.count(params);
    }

    @UseGuards(MyJwtAuthGuard)
    @MetaScope({ entity, accessKey: 'GET_FORM' })
    @Get(`/form/:page`)
    getForm(@Param('page') page: string): Promise<FormSchemaResponse> {
      return this.getService.getForm(page);
    }

    @UseGuards(MyJwtAuthGuard)
    @MetaScope({ entity, accessKey: 'GROUP_BY' })
    @Get(`/groupby/:relation`)
    async groupBy(
      @Param('relation') relation: string,
      @Query() params: SearchParams
    ): Promise<GroupByResponse[]> {
      this.isMethodAllowed('groupby');
      await this.schemaValidator.validateRequestSchema(
        this.requestSchema,
        'groupBy',
        params,
        [],
        true
      );
      return this.getService.groupBy(relation, params);
    }
  }

  Object.defineProperty(GenericGetControllerHost, 'name', {
    value: `Generic${entity.capitalizeFirstLetter()}GetController`
  });

  return GenericGetControllerHost;
}
