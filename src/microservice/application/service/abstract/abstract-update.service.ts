import { NotFoundException } from '@devseeder/microservices-exceptions';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { AbstractDBService } from './abstract-db.service';
import { Relation } from 'src/microservice/domain/interface/relation.interface';
import {
  AbstractDocument,
  AbstractSchema
} from 'src/microservice/domain/schemas/abstract.schema';

@Injectable()
export abstract class AbstractUpdateService<
  Collection,
  MongooseModel,
  ResponseModel
> extends AbstractDBService<Collection, MongooseModel, ResponseModel> {
  constructor(
    protected readonly repository: MongooseRepository<
      Collection,
      MongooseModel
    >,
    protected readonly itemLabel: string = '',
    protected readonly relations: Relation[] = []
  ) {
    super(repository, relations);
  }

  async updateById(
    id: string,
    body: Partial<MongooseModel> | Partial<AbstractDocument>
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
