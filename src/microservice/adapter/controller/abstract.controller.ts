import { NotFoundException } from '@devseeder/microservices-exceptions';
import { Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { SearchPetDto } from 'src/microservice/application/dto/search/search-pet.dto';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { SchemaValidator } from 'src/microservice/application/helper/schema-validator.helper';
import { AbstractGetService } from 'src/microservice/application/service/abstract/abstract-get.service';
import { AbstractTransformation } from 'src/microservice/application/transform/abstract.transformation';
import { InputSchema } from 'src/microservice/domain/interface/input-schema.interface';

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
    protected readonly inputSchema: InputSchema
  ) {}

  // @UseGuards(MyJwtAuthGuard)
  // @Scopes(EnumScopes.USER)
  @Get(`/:id`)
  async getById(@Param('id') id: string): Promise<GetResponse> {
    const item = await this.getService.getById(id);
    if (!item) throw new NotFoundException('Pet');
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
}
