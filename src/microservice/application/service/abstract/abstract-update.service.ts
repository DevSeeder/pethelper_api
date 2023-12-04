import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { AbstractDBService } from './abstract-db.service';
import { AbstractBodyDto } from '../../dto/body/abtract-body.dto';
import { AbstractSchema } from 'src/microservice/domain/schemas/abstract.schema';
import { FieldSchema } from 'src/microservice/domain/schemas/field-schemas.schema';
import { DependecyTokens } from '../../app.constants';

@Injectable()
export abstract class AbstractUpdateService<
  Collection,
  MongooseModel,
  ResponseModel,
  BodyDto extends AbstractBodyDto,
  SearchParams
> extends AbstractDBService<
  Collection,
  MongooseModel,
  ResponseModel,
  SearchParams
> {
  constructor(
    protected readonly repository: MongooseRepository<
      Collection,
      MongooseModel
    >,
    protected readonly itemLabel: string = '',
    protected readonly entityLabels: string[] = [],
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(repository, entityLabels, itemLabel, fieldSchemaData);
  }

  async updateById(
    id: string,
    body: Partial<BodyDto> | Partial<AbstractSchema>
  ): Promise<void> {
    if (!body || !Object.keys(body).length)
      throw new BadRequestException('Empty body');

    this.logger.log(`Updating record by id '${id}'`);

    await this.validateId(id);
    await this.convertRelation(body);

    this.logger.log(`Body: ${JSON.stringify(body)}`);

    await this.repository.updateOneById(id, body);
  }

  async updateBy(
    search: SearchParams,
    body: Partial<BodyDto> | Partial<AbstractSchema>
  ): Promise<void> {
    if (!body || !Object.keys(body).length)
      throw new BadRequestException('Empty body');

    this.logger.log(`Updating records by '${JSON.stringify(search)}'`);

    const searchWhere = await this.buildSearchParams(search);

    const items = await this.repository.find(
      searchWhere,
      { name: 1 },
      {},
      false
    );

    if (!items.length)
      throw new NotFoundException('No record found to be updated.');

    this.logger.log(`Body: ${JSON.stringify(body)}`);

    await this.convertRelation(body);

    try {
      await this.repository.updateMany(searchWhere, body);
    } catch (err) {
      throw new ConflictException(
        'The records are already updated with this values'
      );
    }
  }
}
