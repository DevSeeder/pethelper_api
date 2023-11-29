import { Injectable, NotAcceptableException } from '@nestjs/common';
import { AbstractDBService } from './abstract-db.service';
import { Search } from '../../dto/search/search.dto';
import { MongoDBException } from '@devseeder/microservices-exceptions';
import { ObjectId } from 'mongoose';
import { GetFieldSchemaService } from '../field-schemas/get-field-schemas.service';
import { AbstractRepository } from 'src/microservice/adapter/repository/abstract.repository';

@Injectable()
export abstract class AbstractCreateService<
  Collection,
  MongooseModel,
  ResponseModel,
  BodyDto
> extends AbstractDBService<Collection, MongooseModel, ResponseModel, Search> {
  constructor(
    protected readonly repository: AbstractRepository<
      Collection,
      MongooseModel
    >,
    protected readonly itemLabel: string = '',
    protected readonly entityLabels: string[] = [],
    protected readonly getFieldSchemaService?: GetFieldSchemaService
  ) {
    super(repository, entityLabels, itemLabel, getFieldSchemaService);
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
      return { _id: insertedId };
    } catch (err) {
      if (err instanceof MongoDBException) {
        if (err.errCode === 11000) {
          throw new NotAcceptableException(`${this.itemLabel} already exists`);
        }
      }
    }
  }

  async clone(id: string): Promise<{ _id: ObjectId }> {
    this.logger.log(`Cloning ${this.itemLabel} '${id}'...`);

    const cloneTarget = await this.validateId(id);

    const bodyCreate = {
      ...cloneTarget,
      active: true
    };

    await this.getUniqueIndexToClone(bodyCreate);

    const insertedId = await this.repository.insertOne(
      bodyCreate as Collection,
      this.itemLabel
    );
    return { _id: insertedId };
  }

  private async getUniqueIndexToClone(bodyCreate: MongooseModel) {
    const objIndexes = await this.repository.getIndexes();
    delete objIndexes['_id_'];
    const mapKeys = Object.values(objIndexes).map((key) => key[0][0]);

    mapKeys.forEach((key) => {
      if (typeof bodyCreate[key] == 'string')
        bodyCreate[key] = `${bodyCreate[key]} copy`;
    });

    delete bodyCreate['_id'];
    delete bodyCreate['createdAt'];
    delete bodyCreate['updatedAt'];
    delete bodyCreate['inactivationDate'];
  }
}
