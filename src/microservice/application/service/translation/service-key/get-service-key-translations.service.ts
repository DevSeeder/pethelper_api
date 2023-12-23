import { Injectable } from '@nestjs/common';
import { ServiceKeyTranslationsRepository } from 'src/microservice/adapter/repository/translations/service-key-translations.repository';
import { GLOBAL_ENTITY, PROJECT_KEY } from '../../../app.constants';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { ServiceKeyTranslation } from 'src/microservice/domain/schemas/translations/service-key-translations.schema';

@Injectable()
export class GetServiceKeyTranslationService extends AbstractService {
  constructor(protected readonly repository: ServiceKeyTranslationsRepository) {
    super();
  }

  async getAll(): Promise<ServiceKeyTranslation[]> {
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
