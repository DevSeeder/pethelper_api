import { Injectable } from '@nestjs/common';
import {
  AbstractService,
  Search
} from '@devseeder/nestjs-microservices-commons';
import { AbstractUpdateService } from '../abstract/abstract-update.service';
import { AbstractSchema } from 'src/microservice/domain/schemas/abstract.schema';
import { InactivationReason } from 'src/microservice/domain/enum/inactivation-reason.enum';

@Injectable()
export class RollbackCloneService<
  Collection,
  MongooseModel extends AbstractSchema,
  ResponseModel,
  BodyDto
> extends AbstractService {
  constructor(
    protected readonly updateService: AbstractUpdateService<
      Collection,
      MongooseModel,
      ResponseModel,
      BodyDto,
      Search
    >,
    protected readonly entity: string
  ) {
    super();
  }

  async rollbackClone(clonedId: string): Promise<void> {
    this.logger.log(`Starting Rollback cloned ${this.entity} - id ${clonedId}`);
    await this.updateService.activation(
      clonedId,
      false,
      '*',
      InactivationReason.ROLLBACK_CLONE
    );
    this.logger.log('Rollback finished');
  }
}
