import { Body, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { SchemaValidator } from 'src/microservice/application/helper/validator/schema-validator.helper';
import { AbstractGetService } from 'src/microservice/application/service/abstract/abstract-get.service';
import { AbstractUpdateService } from 'src/microservice/application/service/abstract/abstract-update.service';
import {
  InputSchema,
  RequestSchema
} from 'src/microservice/domain/interface/input-schema.interface';
import { AbstractCreateService } from 'src/microservice/application/service/abstract/abstract-create.service';
import { AbstractBodyDto } from 'src/microservice/application/dto/body/abtract-body.dto';
import { ObjectId } from 'mongoose';
import { FormSchemaResponse } from 'src/microservice/domain/interface/field-schema.interface';
import { FieldSchemaBuilder } from 'src/microservice/application/helper/validator/field-schema.builder';
import {
  ClonyManyBodyDto,
  ClonyOneBodyDto
} from 'src/microservice/application/dto/body/clone-body.dto';
import {
  CloneManyResponse,
  CloneOneResponse
} from 'src/microservice/application/dto/response/clone.response';
import {
  CountResponse,
  PaginatedResponse
} from 'src/microservice/application/dto/response/paginated.response';
import { GroupByResponse } from 'src/microservice/application/dto/response/groupby/group-by.response';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { AbstractEntityLoader } from './abstract-entity.loader';
import { ActivationQueryParams } from 'src/microservice/application/dto/query/activation-query-params.dto';
import { AbstractSchema } from 'src/microservice/domain/schemas/abstract.schema';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { ErrorKeys } from 'src/microservice/domain/enum/error-keys.enum';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';

export abstract class AbstractController<
  Collection,
  MongooseModel extends AbstractSchema,
  GetResponse,
  SearchParams extends Search,
  BodyDto extends AbstractBodyDto
> extends AbstractEntityLoader {
  protected requestSchema: RequestSchema;
  protected schemaValidator: SchemaValidator;

  constructor(
    protected readonly entity: string,
    protected readonly getService?: AbstractGetService<
      Collection,
      MongooseModel,
      GetResponse,
      SearchParams
    >,
    protected readonly updateService?: AbstractUpdateService<
      Collection,
      MongooseModel,
      GetResponse,
      BodyDto,
      SearchParams
    >,
    protected readonly createService?: AbstractCreateService<
      Collection,
      MongooseModel,
      GetResponse,
      BodyDto
    >,
    protected readonly fieldSchemaData?: FieldSchema[],
    protected readonly entitySchemaData?: EntitySchema[],
    protected readonly errorService?: ErrorService,
    protected readonly translationService?: GetTranslationService
  ) {
    super(entity, fieldSchemaData, entitySchemaData);

    this.requestSchema = new FieldSchemaBuilder(
      errorService,
      translationService,
      entity,
      entitySchemaData
    ).buildRequestSchemas(this.fieldSchemaDb, this.fieldSchemaData);

    this.schemaValidator = new SchemaValidator(
      errorService,
      translationService,
      this.entitySchema,
      this.entitySchemaData
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

  @Patch(`inactivate/:id`)
  async inactivate(
    @Param('id') id: string,
    @Query() queryParams: ActivationQueryParams
  ): Promise<void> {
    this.isMethodAllowed('inactivate');
    await this.schemaValidator.validateRequestSchema(
      this.requestSchema,
      'activation',
      queryParams
    );
    await this.updateService.activation(
      id,
      false,
      queryParams.cascadeRelations
    );
  }

  @Patch(`activate/:id`)
  async activate(
    @Param('id') id: string,
    @Query() queryParams: ActivationQueryParams
  ): Promise<void> {
    this.isMethodAllowed('activate');
    await this.schemaValidator.validateRequestSchema(
      this.requestSchema,
      'activation',
      queryParams
    );
    await this.updateService.activation(id, true, queryParams.cascadeRelations);
  }

  @Patch(`/:id`)
  async updateById(
    @Param('id') id: string,
    @Body() body: BodyDto
  ): Promise<void> {
    this.isMethodAllowed('updateById');
    await this.schemaValidator.validateRequestSchema(
      this.requestSchema,
      'update',
      body,
      this.fieldSchemaData
    );
    await this.updateService.updateById(id, body as unknown as BodyDto);
  }

  @Patch(`/`)
  async updateBy(
    @Query() params: SearchParams,
    @Body() body: BodyDto
  ): Promise<void> {
    this.isMethodAllowed('updateBy');
    await this.schemaValidator.validateRequestSchema(
      this.requestSchema,
      'search',
      params,
      [],
      true
    );
    await this.schemaValidator.validateRequestSchema(
      this.requestSchema,
      'update',
      body,
      this.fieldSchemaData
    );
    await this.updateService.updateBy(params, body);
  }

  @Post(`/`)
  async create(@Body() body: BodyDto): Promise<{ _id: ObjectId }> {
    this.isMethodAllowed('create');
    await this.schemaValidator.validateRequestSchema(
      this.requestSchema,
      'create',
      body,
      this.fieldSchemaData
    );
    return this.createService.create(body as unknown as BodyDto);
  }

  @Get(`/form/:page`)
  getForm(@Param('page') page: string): Promise<FormSchemaResponse> {
    return this.getService.getForm(page);
  }

  @Post(`/clone/:id`)
  async cloneById(
    @Param('id') id: string,
    @Body() body: ClonyOneBodyDto
  ): Promise<CloneOneResponse> {
    this.isMethodAllowed('cloneById');
    await this.schemaValidator.validateRequestSchema(
      this.requestSchema,
      'cloneOne',
      body,
      this.fieldSchemaData
    );
    const response = await this.createService.cloneByIds(
      [id],
      body.cloneRelations,
      body.replaceBody
    );
    return response[0];
  }

  @Post(`/clone`)
  async cloneManyByIds(
    @Body()
    body: ClonyManyBodyDto
  ): Promise<CloneManyResponse> {
    this.isMethodAllowed('cloneManyByIds');
    await this.schemaValidator.validateRequestSchema(
      this.requestSchema,
      'cloneMany',
      body,
      this.fieldSchemaData
    );
    return this.createService.cloneByIds(
      body._ids,
      body.cloneRelations,
      body.replaceBody
    );
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

  private isMethodAllowed(method: string) {
    if (!this.entitySchema.forbiddenMethods) return;
    const notAllowed = this.entitySchema.forbiddenMethods.filter(
      (m) => m === method
    );
    if (notAllowed.length)
      this.errorService.throwError(ErrorKeys.METHOD_NOT_ALLOWED);
  }
}
