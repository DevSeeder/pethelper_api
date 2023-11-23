import { NotFoundException } from '@devseeder/microservices-exceptions';
import { Body, Get, Param, Patch, Query, ValidationPipe } from '@nestjs/common';
import { SearchPetDto } from 'src/microservice/application/dto/search/search-pet.dto';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { DateHelper } from 'src/microservice/application/helper/date.helper';
import { SchemaValidator } from 'src/microservice/application/helper/schema-validator.helper';
import { AbstractGetService } from 'src/microservice/application/service/abstract/abstract-get.service';
import { AbstractUpdateService } from 'src/microservice/application/service/abstract/abstract-update.service';
import { AbstractTransformation } from 'src/microservice/application/transform/abstract.transformation';
import { InputSchema } from 'src/microservice/domain/interface/input-schema.interface';
import { PetInputSchema } from '../schemas/pet-input.schema';

export abstract class AbstractController<
  Collection,
  MongooseModel,
  GetResponse,
  SearchParams extends Search
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
    protected readonly updateService: AbstractUpdateService<
      Collection,
      MongooseModel,
      GetResponse
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
    @Query() params: SearchPetDto,
    @Param('searchId') searchId: string
  ): Promise<GetResponse[]> {
    params[this.searchKey] = searchId;
    SchemaValidator.validateSchema(this.inputSchema.search, params);
    return this.getService.search(
      this.transformation.convertReferenceDB(params as unknown as SearchParams)
    );
  }

  @Get(`/`)
  getAll(): Promise<GetResponse[]> {
    return this.getService.search();
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
  async update(@Param('id') id: string, @Body() body: any): Promise<void> {
    SchemaValidator.validateSchema(PetInputSchema.update, body);
    await this.updateService.updateById(id, body);
  }
}
