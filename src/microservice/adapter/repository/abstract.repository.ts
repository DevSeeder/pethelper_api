import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';

@Injectable()
export abstract class AbstractRepository<
  Collection,
  CollectionDocument
> extends MongooseRepository<Collection, CollectionDocument> {
  constructor(model: Model<CollectionDocument>) {
    super(model);
  }

  getIndexes(): object {
    return this.model.collection.getIndexes() as unknown as object;
  }

  async count(searchParams: object): Promise<number> {
    return this.model.countDocuments(searchParams);
  }
}
