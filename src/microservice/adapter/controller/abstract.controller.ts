import { NotFoundException } from '@devseeder/microservices-exceptions';
import {
  BadRequestException,
  Body,
  ForbiddenException,
  Get,
  Logger,
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
import { GetFieldSchemaService } from 'src/microservice/application/service/configuration/field-schemas/get-field-schemas.service';
import { singleCloneSchema } from 'src/microservice/domain/field-schemas/abstract-input.schema';
import {
  ClonyManyBodyDto,
  ClonyOneBodyDto
} from 'src/microservice/application/dto/body/clone-body.dto';
import {
  CloneManyResponse,
  CloneOneResponse
} from 'src/microservice/application/dto/response/clone.response';

export abstract class AbstractController<
  Collection,
  MongooseModel,
  GetResponse,
  SearchParams extends Search,
  BodyDto extends AbstractBodyDto
> {
  protected readonly logger: Logger = new Logger(AbstractController.name);
  protected inputSchema: InputSchema;

  constructor(
    protected readonly itemLabel: string,
    protected readonly entityLabels: string[],
    protected readonly searchKey: string = '',
    protected readonly forbbidenMethods: string[] = [],
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
    protected readonly getFieldSchemaService?: GetFieldSchemaService
  ) {
    this.init();
  }

  private async init() {
    if (!this.getFieldSchemaService) return;

    try {
      this.logger.log(`Initializing controller for '${this.itemLabel}'...`);

      const fieldSchemaDb = await this.getFieldSchemaService.search(
        this.entityLabels
      );
      this.inputSchema = FieldSchemaBuilder.buildSchemas(fieldSchemaDb);
      this.logger.log(`Controller for '${this.itemLabel}' finished`);
    } catch (err) {
      this.logger.error(
        `Error loading controller for '${this.itemLabel}': ${JSON.stringify(
          err
        )}`
      );
      throw err;
    }
  }

  // @UseGuards(MyJwtAuthGuard)
  // @Scopes(EnumScopes.USER)
  @Get(`/:id`)
  async getById(@Param('id') id: string): Promise<GetResponse> {
    const item = await this.getService.getById(id);
    if (!item) throw new NotFoundException(this.itemLabel);
    return item;
  }

  @Get(`/search/:searchId`)
  searchBy(
    @Query() params: SearchParams,
    @Param('searchId') searchId: string
  ): Promise<GetResponse[]> {
    this.isMethodAllowed('searchBy');

    if (params[this.searchKey] !== undefined)
      throw new BadRequestException(`'${this.searchKey}' is not allowed.`);
    SchemaValidator.validateSchema(this.inputSchema.search, params);

    if (this.searchKey) params[this.searchKey] = searchId;

    return this.getService.search(params);
  }

  @Get(`/`)
  searchAll(@Query() params: SearchParams): Promise<GetResponse[]> {
    SchemaValidator.validateSchema(this.inputSchema.search, params);
    return this.getService.search(params);
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
    SchemaValidator.validateSchema(this.inputSchema.update, body);
    await this.updateService.updateById(id, body as unknown as BodyDto);
  }

  @Patch(`/`)
  async updateBy(
    @Query() params: SearchParams,
    @Body() body: BodyDto
  ): Promise<void> {
    this.isMethodAllowed('updateBy');
    SchemaValidator.validateSchema(this.inputSchema.search, params);
    SchemaValidator.validateSchema(this.inputSchema.update, body);
    await this.updateService.updateBy(params, body);
  }

  @Post(`/`)
  async create(@Body() body: BodyDto): Promise<{ _id: ObjectId }> {
    this.isMethodAllowed('create');
    SchemaValidator.validateSchema(this.inputSchema.create, body);
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
    SchemaValidator.validateSchema(this.inputSchema.cloneOne, body);
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
    SchemaValidator.validateSchema(this.inputSchema.cloneMany, body);
    return this.createService.cloneByIds(
      body._ids,
      body.cloneRelations,
      body.replaceBody
    );
  }

  private isMethodAllowed(method: string) {
    const notAllowed = this.forbbidenMethods.filter((m) => m === method);
    if (notAllowed.length) throw new ForbiddenException('Method not allowed');
  }
}
