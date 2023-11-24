import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { AbstractDBService } from './abstract-db.service';
import { Relation } from 'src/microservice/domain/interface/relation.interface';
import { Search } from '../../dto/search/search.dto';
import {
  InvalidDataException,
  MongoDBException
} from '@devseeder/microservices-exceptions';
import { ObjectId } from 'mongoose';

@Injectable()
export abstract class AbstractCreateService<
  Collection,
  MongooseModel,
  ResponseModel,
  BodyDto
> extends AbstractDBService<Collection, MongooseModel, ResponseModel, Search> {
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

  async create(body: BodyDto): Promise<{ _id: ObjectId }> {
    await this.convertRelation(body);

    this.logger.log(`Body: ${JSON.stringify(body)}`);

    const bodyCreate = {
      ...body,
      active: true
    };

    try {
      const insertedId = await this.repository.insertOne(
        bodyCreate as Collection,
        this.itemLabel
      );
      this.logger.log(`${this.itemLabel} '${insertedId}' successfully created`);
      return { _id: insertedId };
    } catch (err) {
      if (err instanceof MongoDBException) {
        if (err.errCode === 11000) {
          throw new NotAcceptableException(`${this.itemLabel} already exists`);
        }
      }
    }
  }
}
