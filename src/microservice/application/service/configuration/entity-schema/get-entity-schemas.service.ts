import { Injectable } from '@nestjs/common';
import { EntitySchemasRepository } from 'src/microservice/adapter/repository/configuration/entity-schemas.repository';
import { GLOBAL_ENTITY, PROJECT_KEY } from '../../../app.constants';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';

@Injectable()
export class GetEntitySchemaService extends AbstractService {
  constructor(protected readonly repository: EntitySchemasRepository) {
    super();
  }

  async search(entityLabels: string[]): Promise<EntitySchema[]> {
    const itens = await this.repository.find(
      {
        projectKey: PROJECT_KEY,
        entity: {
          $in: [...entityLabels, GLOBAL_ENTITY]
        }
      },
      { projectKey: 0 },
      { order: 1 },
      false
    );

    return itens;
  }

  async getAll(): Promise<EntitySchema[]> {
    const itens = await this.repository.find(
      {
        projectKey: PROJECT_KEY
      },
      { projectKey: 0 },
      { order: 1 },
      false
    );

    return itens;
  }
}
