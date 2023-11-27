import { Injectable } from '@nestjs/common';
import { FieldSchemasRepository } from 'src/microservice/adapter/repository/field-schemas.repository';
import { GLOBAL_ENTITY, PROJECT_KEY } from '../../app.constants';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';

@Injectable()
export class GetFieldSchemaService extends AbstractService {
  constructor(protected readonly repository: FieldSchemasRepository) {
    super();
  }

  async search(entityLabels: string[]): Promise<FieldItemSchema[]> {
    const itens = await this.repository.find(
      {
        projectKey: PROJECT_KEY,
        entity: {
          $in: [...entityLabels, GLOBAL_ENTITY]
        }
      },
      { all: 0 },
      {},
      false
    );

    return itens;
  }
}
