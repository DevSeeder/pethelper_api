import { NotFoundException } from '@devseeder/microservices-exceptions';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { AbstractDBService } from './abstract-db.service';
import { AbstractBodyDto } from '../../dto/body/abtract-body.dto';
import { AbstractSchema } from 'src/microservice/domain/schemas/abstract.schema';
import { Search } from '../../dto/search/search.dto';
import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';
import { GetFieldSchemaService } from '../field-schemas/get-field-schemas.service';

@Injectable()
export abstract class AbstractUpdateService<
  Collection,
  MongooseModel,
  ResponseModel,
  BodyDto extends AbstractBodyDto
> extends AbstractDBService<Collection, MongooseModel, ResponseModel, Search> {
  constructor(
    protected readonly repository: MongooseRepository<
      Collection,
      MongooseModel
    >,
    protected readonly itemLabel: string = '',
    protected readonly entityLabels: string[] = [],
    protected readonly getFieldSchemaService?: GetFieldSchemaService
  ) {
    super(repository, entityLabels, getFieldSchemaService);
  }

  async updateById(
    id: string,
    body: Partial<BodyDto> | Partial<AbstractSchema>
  ): Promise<void> {
    this.logger.log(`Updating record by id '${id}'`);

    await this.validateId(id);
    await this.convertRelation(body);

    this.logger.log(`Body: ${JSON.stringify(body)}`);

    await this.repository.updateOneById(id, body);
  }

  private async validateId(id: string): Promise<void> {
    let item;
    try {
      item = await this.repository.findById(id);
    } catch (err) {
      throw new NotFoundException(this.itemLabel);
    }
    if (!item) throw new NotFoundException(this.itemLabel);
  }
}
