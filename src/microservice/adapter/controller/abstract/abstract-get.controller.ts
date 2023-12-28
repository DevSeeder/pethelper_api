import { Get, Param, Query } from '@nestjs/common';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { SchemaValidator } from 'src/microservice/application/helper/validator/schema-validator.helper';
import { GenericGetService } from 'src/microservice/application/service/abstract/generic-get.service';
import { RequestSchema } from 'src/microservice/domain/interface/input-schema.interface';
import { AbstractBodyDto } from 'src/microservice/application/dto/body/abtract-body.dto';
import { FormSchemaResponse } from 'src/microservice/domain/interface/field-schema.interface';
import {
  CountResponse,
  PaginatedResponse
} from 'src/microservice/application/dto/response/paginated.response';
import { GroupByResponse } from 'src/microservice/application/dto/response/groupby/group-by.response';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { ErrorKeys } from 'src/microservice/domain/enum/error-keys.enum';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';
import { AbstractController } from './abstract.controller';

export abstract class AbstractGetController<
  Collection,
  GetResponse,
  SearchParams extends Search,
  BodyDto extends AbstractBodyDto
> extends AbstractController<Collection, GetResponse, SearchParams, BodyDto> {
  requestSchema: RequestSchema;
  schemaValidator: SchemaValidator;

  constructor(
    readonly entity: string,
    readonly getService?: GenericGetService<
      Collection,
      GetResponse,
      SearchParams
    >,
    readonly fieldSchemaData?: FieldSchema[],
    readonly entitySchemaData?: EntitySchema[],
    readonly errorService?: ErrorService,
    readonly translationService?: GetTranslationService
  ) {
    super(
      entity,
      fieldSchemaData,
      entitySchemaData,
      errorService,
      translationService
    );
  }

  // @UseGuards(MyJwtAuthGuard)
  // @Scopes(EnumScopes.USER)
  @Get(`/:id`)
  async getById(@Param('id') id: string): Promise<GetResponse> {
    return this.getService.getById(id, true);
  }

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

  @Get(`/form/:page`)
  getForm(@Param('page') page: string): Promise<FormSchemaResponse> {
    return this.getService.getForm(page);
  }

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
