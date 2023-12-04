import { NotFoundException } from '@devseeder/microservices-exceptions';
import {
  BadRequestException,
  Body,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { DateHelper } from 'src/microservice/application/helper/date.helper';
import { SchemaValidator } from 'src/microservice/application/helper/schema-validator.helper';
import { AbstractGetService } from 'src/microservice/application/service/abstract/abstract-get.service';
import { AbstractUpdateService } from 'src/microservice/application/service/abstract/abstract-update.service';
import { InputSchema } from 'src/microservice/domain/interface/input-schema.interface';
import { AbstractCreateService } from 'src/microservice/application/service/abstract/abstract-create.service';
import { AbstractBodyDto } from 'src/microservice/application/dto/body/abtract-body.dto';
import { ObjectId } from 'mongoose';
import { FieldSchemaResponse } from 'src/microservice/domain/interface/field-schema.interface';
import { FieldSchemaBuilder } from 'src/microservice/application/helper/field-schema.builder';
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

export abstract class AbstractController<
  Collection,
  MongooseModel,
  GetResponse,
  SearchParams extends Search,
  BodyDto extends AbstractBodyDto
> extends AbstractEntityLoader {
  protected inputSchema: InputSchema;

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
    protected readonly entitySchemaData?: EntitySchema[]
  ) {
    super(entity, fieldSchemaData, entitySchemaData);

    this.inputSchema = FieldSchemaBuilder.buildSchemas(this.fieldSchemaDb);
  }

  // @UseGuards(MyJwtAuthGuard)
  // @Scopes(EnumScopes.USER)
  @Get(`/:id`)
  async getById(@Param('id') id: string): Promise<GetResponse> {
    const item = await this.getService.getById(id);
    if (!item) throw new NotFoundException(this.entitySchema.itemLabel);
    return item;
  }

  @Get(`/search/:searchId`)
  searchBy(
    @Query() params: SearchParams,
    @Param('searchId') searchId: string
  ): Promise<PaginatedResponse<GetResponse>> {
    this.isMethodAllowed('searchBy');

    if (params[this.entitySchema.searchKey] !== undefined)
      throw new BadRequestException(
        `'${this.entitySchema.searchKey}' is not allowed.`
      );

    SchemaValidator.validateSchema(this.inputSchema.search, params);

    if (this.entitySchema.searchKey)
      params[this.entitySchema.searchKey] = searchId;

    return this.getService.search(params);
  }

  @Get(`/`)
  searchAll(
    @Query() params: SearchParams
  ): Promise<PaginatedResponse<GetResponse>> {
    SchemaValidator.validateSchema(this.inputSchema.search, params);
    return this.getService.search(params);
  }

  @Get(`/meta/count`)
  count(@Query() params: SearchParams): Promise<CountResponse> {
    SchemaValidator.validateSchema(this.inputSchema.count, params);
    return this.getService.count(params);
  }

  @Patch(`inactivate/:id`)
  async inactivate(@Param('id') id: string): Promise<void> {
    this.isMethodAllowed('inactivate');
    await this.updateService.updateById(id, {
      active: false,
      inactivationDate: DateHelper.getDateNow()
    });
  }

  @Patch(`activate/:id`)
  async activate(@Param('id') id: string): Promise<void> {
    this.isMethodAllowed('activate');
    await this.updateService.updateById(id, {
      active: true
    });
  }

  @Patch(`/:id`)
  async updateById(
    @Param('id') id: string,
    @Body() body: BodyDto
  ): Promise<void> {
    this.isMethodAllowed('updateById');
    SchemaValidator.validateSchema(
      this.inputSchema.update,
      body,
      this.fieldSchemaDb
    );
    await this.updateService.updateById(id, body as unknown as BodyDto);
  }

  @Patch(`/`)
  async updateBy(
    @Query() params: SearchParams,
    @Body() body: BodyDto
  ): Promise<void> {
    this.isMethodAllowed('updateBy');
    SchemaValidator.validateSchema(
      this.inputSchema.search,
      params,
      this.fieldSchemaDb
    );
    SchemaValidator.validateSchema(
      this.inputSchema.update,
      body,
      this.fieldSchemaDb
    );
    await this.updateService.updateBy(params, body);
  }

  @Post(`/`)
  async create(@Body() body: BodyDto): Promise<{ _id: ObjectId }> {
    this.isMethodAllowed('create');
    SchemaValidator.validateSchema(
      this.inputSchema.create,
      body,
      this.fieldSchemaDb
    );
    return this.createService.create(body as unknown as BodyDto);
  }

  @Get(`/form/:page`)
  getForm(@Param('page') page: string): Promise<FieldSchemaResponse> {
    return this.getService.getForm(page);
  }

  @Post(`/clone/:id`)
  async cloneById(
    @Param('id') id: string,
    @Body() body: ClonyOneBodyDto
  ): Promise<CloneOneResponse> {
    this.isMethodAllowed('cloneById');
    SchemaValidator.validateSchema(
      this.inputSchema.cloneOne,
      body,
      this.fieldSchemaDb
    );
    return this.createService.clone(
      id,
      true,
      body.cloneRelations,
      body.replaceBody
    );
  }

  @Post(`/clone`)
  async cloneManyByIds(
    @Body()
    body: ClonyManyBodyDto
  ): Promise<CloneManyResponse> {
    this.isMethodAllowed('cloneManyByIds');
    SchemaValidator.validateSchema(
      this.inputSchema.cloneMany,
      body,
      this.fieldSchemaDb
    );
    return this.createService.cloneByIds(
      body._ids,
      body.cloneRelations,
      body.replaceBody
    );
  }

  @Get(`/groupby/:relation`)
  groupBy(
    @Param('relation') relation: string,
    @Query() params: SearchParams
  ): Promise<GroupByResponse[]> {
    this.isMethodAllowed('groupby');
    SchemaValidator.validateSchema(this.inputSchema.groupBy, params);
    return this.getService.groupBy(relation, params);
  }

  private isMethodAllowed(method: string) {
    if (!this.entitySchema.forbidenMethods) return;
    const notAllowed = this.entitySchema.forbidenMethods.filter(
      (m) => m === method
    );
    if (notAllowed.length) throw new ForbiddenException('Method not allowed');
  }
}
