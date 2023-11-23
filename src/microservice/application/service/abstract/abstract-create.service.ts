import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { AbstractDBService } from './abstract-db.service';
import { Relation } from 'src/microservice/domain/interface/relation.interface';

@Injectable()
export abstract class AbstractCreateService<
  Collection,
  MongooseModel,
  ResponseModel,
  BodyDto
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

  async create(body: BodyDto): Promise<void> {
    await this.convertRelation(body);

    this.logger.log(`Body: ${JSON.stringify(body)}`);

    const bodyCreate = {
      ...body,
      active: true
    };

    await this.repository.insertOne(bodyCreate as Collection, this.itemLabel);
  }
}
