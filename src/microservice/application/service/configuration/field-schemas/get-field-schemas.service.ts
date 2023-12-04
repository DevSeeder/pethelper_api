import { Injectable } from '@nestjs/common';
import { FieldSchemasRepository } from 'src/microservice/adapter/repository/configuration/field-schemas.repository';
import { GLOBAL_ENTITY, PROJECT_KEY } from '../../../app.constants';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { FormFieldResponse } from 'src/microservice/domain/interface/field-schema.interface';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';

@Injectable()
export class GetFieldSchemaService extends AbstractService {
  constructor(protected readonly repository: FieldSchemasRepository) {
    super();
  }

  async search(entityLabels: string[]): Promise<FieldSchema[]> {
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

  async getAll(): Promise<FieldSchema[]> {
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

  async getExtRelations(
    entity: string,
    clone = false
  ): Promise<Array<FieldSchema & FormFieldResponse>> {
    this.logger.log(
      `Searching ${JSON.stringify({
        projectKey: PROJECT_KEY,
        type: 'externalId',
        'externalRelation.service': entity,
        'externalRelation.clone': clone
      })}`
    );
    const itens = await this.repository.find(
      {
        projectKey: PROJECT_KEY,
        type: 'externalId',
        'externalRelation.service': entity,
        'externalRelation.clone': clone
      },
      { projectKey: 0 },
      { order: 1 },
      false
    );

    return itens;
  }
}
