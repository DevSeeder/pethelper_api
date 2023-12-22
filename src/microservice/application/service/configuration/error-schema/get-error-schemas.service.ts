import { Injectable } from '@nestjs/common';
import { ErrorSchemasRepository } from 'src/microservice/adapter/repository/config-schemas/error-schemas.repository';
import { GLOBAL_ENTITY, PROJECT_KEY } from '../../../app.constants';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { ErrorSchema } from 'src/microservice/domain/schemas/configuration-schemas/error-schemas.schema';

@Injectable()
export class GetErrorSchemaService extends AbstractService {
  constructor(protected readonly repository: ErrorSchemasRepository) {
    super();
  }
  async getAll(): Promise<ErrorSchema[]> {
    const itens = await this.repository.find(
      {
        projectKey: {
          $in: [GLOBAL_ENTITY, PROJECT_KEY]
        }
      },
      { projectKey: 0 },
      { order: 1 },
      false
    );

    return itens;
  }
}
