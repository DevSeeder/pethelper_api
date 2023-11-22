import { NotFoundException } from '@devseeder/microservices-exceptions';
import { Get, Param, Query } from '@nestjs/common';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { AbstractGetService } from 'src/microservice/application/service/abstract/abstract-get.service';
import { AbstractTransformation } from 'src/microservice/application/transform/abstract.transformation';

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
    protected readonly transformation: AbstractTransformation<SearchParams>
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
    @Query() params: SearchParams,
    @Param('searchId') searchId: string
  ): Promise<GetResponse[]> {
    const searchInput = params;
    searchInput[this.searchKey] = searchId;
    return this.getService.search(
      this.transformation.convertReferenceDB(searchInput)
    );
  }

  @Get(`/`)
  getAll(): Promise<GetResponse[]> {
    return this.getService.search();
  }
}
