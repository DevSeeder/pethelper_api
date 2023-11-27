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
import { PetBodyDto } from 'src/microservice/application/dto/body/pet-body.dto';
import { AbstractCreateService } from 'src/microservice/application/service/abstract/abstract-create.service';
import { AbstractBodyDto } from 'src/microservice/application/dto/body/abtract-body.dto';
import { ObjectId } from 'mongoose';
import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';
import { BuildFieldSchemaHelper } from 'src/microservice/application/helper/build-field-schema.helper';

export abstract class AbstractController<
  Collection,
  MongooseModel,
  GetResponse,
  SearchParams extends Search,
  BodyDto extends AbstractBodyDto
> {
  protected inputSchema: InputSchema;
  constructor(
    protected readonly getService: AbstractGetService<
      Collection,
      MongooseModel,
      GetResponse,
      SearchParams
    >,
    protected readonly searchKey: string,
    fieldSchema: FieldItemSchema[],
    protected readonly itemLabel: string,
    protected readonly forbbidenMethods: string[] = [],
    protected readonly updateService?: AbstractUpdateService<
      Collection,
      MongooseModel,
      GetResponse,
      BodyDto
    >,
    protected readonly createService?: AbstractCreateService<
      Collection,
      MongooseModel,
      GetResponse,
      BodyDto
    >
  ) {
    this.inputSchema = BuildFieldSchemaHelper.buildSchemas(fieldSchema);
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
  async update(
    @Param('id') id: string,
    @Body() body: PetBodyDto
  ): Promise<void> {
    this.isMethodAllowed('update');
    SchemaValidator.validateSchema(this.inputSchema.update, body);
    await this.updateService.updateById(id, body as unknown as BodyDto);
  }

  @Post(`/`)
  async create(@Body() body: PetBodyDto): Promise<{ _id: ObjectId }> {
    this.isMethodAllowed('create');
    SchemaValidator.validateSchema(this.inputSchema.create, body);
    return this.createService.create(body as unknown as BodyDto);
  }

  private isMethodAllowed(method: string) {
    const notAllowed = this.forbbidenMethods.filter((m) => m === method);
    if (notAllowed.length) throw new ForbiddenException('Method not allowed');
  }
}
