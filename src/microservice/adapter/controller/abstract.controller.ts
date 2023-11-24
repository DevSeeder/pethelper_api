import { NotFoundException } from '@devseeder/microservices-exceptions';
import {
  BadRequestException,
  Body,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe
} from '@nestjs/common';
import { SearchPetDto } from 'src/microservice/application/dto/search/search-pet.dto';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { DateHelper } from 'src/microservice/application/helper/date.helper';
import { SchemaValidator } from 'src/microservice/application/helper/schema-validator.helper';
import { AbstractGetService } from 'src/microservice/application/service/abstract/abstract-get.service';
import { AbstractUpdateService } from 'src/microservice/application/service/abstract/abstract-update.service';
import { AbstractTransformation } from 'src/microservice/application/transform/abstract.transformation';
import { InputSchema } from 'src/microservice/domain/interface/input-schema.interface';
import { PetInputSchema } from '../schemas/pet-input.schema';
import { PetBodyDto } from 'src/microservice/application/dto/body/pet-body.dto';
import { AbstractCreateService } from 'src/microservice/application/service/abstract/abstract-create.service';
import { AbstractBodyDto } from 'src/microservice/application/dto/body/abtract-body.dto';

export abstract class AbstractController<
  Collection,
  MongooseModel,
  GetResponse,
  SearchParams extends Search,
  BodyDto extends AbstractBodyDto
> {
  constructor(
    protected readonly getService: AbstractGetService<
      Collection,
      MongooseModel,
      GetResponse,
      SearchParams
    >,
    protected readonly searchKey: string,
    protected readonly transformation: AbstractTransformation<SearchParams>,
    protected readonly inputSchema: InputSchema,
    protected readonly itemLabel: string,
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
  ) {}

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
    if (params[this.searchKey] !== undefined)
      throw new BadRequestException(`'${this.searchKey}' is not allowed.`);
    SchemaValidator.validateSchema(this.inputSchema.search, params);
    params[this.searchKey] = searchId;
    return this.getService.search(
      this.transformation
        ? this.transformation.convertReferenceDB(params)
        : params
    );
  }

  @Get(`/`)
  searchAll(@Query() params: SearchParams): Promise<GetResponse[]> {
    SchemaValidator.validateSchema(this.inputSchema.search, params);
    return this.getService.search(
      this.transformation
        ? this.transformation.convertReferenceDB(params)
        : params
    );
  }

  @Patch(`inactivate/:id`)
  async inactivate(@Param('id') id: string): Promise<void> {
    await this.updateService.updateById(id, {
      active: false,
      inactivationDate: DateHelper.getDateNow()
    });
  }

  @Patch(`activate/:id`)
  async activate(@Param('id') id: string): Promise<void> {
    await this.updateService.updateById(id, {
      active: true
    });
  }

  @Patch(`/:id`)
  async update(
    @Param('id') id: string,
    @Body() body: PetBodyDto
  ): Promise<void> {
    SchemaValidator.validateSchema(PetInputSchema.update, body);
    await this.updateService.updateById(id, body as unknown as BodyDto);
  }

  @Post(`/`)
  async create(@Body() body: PetBodyDto): Promise<void> {
    SchemaValidator.validateSchema(PetInputSchema.create, body);
    await this.createService.create(body as unknown as BodyDto);
  }
}
