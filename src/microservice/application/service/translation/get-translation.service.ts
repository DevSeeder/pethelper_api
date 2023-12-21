import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { EntityTranslationsRepository } from 'src/microservice/adapter/repository/translations/entity-translations.repository';
import { FieldTranslationsRepository } from 'src/microservice/adapter/repository/translations/field-translations.repository';
import { FieldTranslation } from 'src/microservice/domain/schemas/translations/field-translations.schema';
import { GLOBAL_ENTITY, PROJECT_KEY } from '../../app.constants';
import { NotFoundException } from '@devseeder/microservices-exceptions';
import { EntityTranslation } from 'src/microservice/domain/schemas/translations/entity-translations.schema';

@Injectable()
export class GetTranslationService extends AbstractService {
  constructor(
    protected readonly fieldRepository: FieldTranslationsRepository,
    protected readonly entityRepository: EntityTranslationsRepository
  ) {
    super();
  }

  async getFieldTranslation(
    entity: string[],
    key: string,
    lang: string
  ): Promise<FieldTranslation> {
    this.logger.log(
      `Searching Field Translation ${JSON.stringify({
        projectKey: PROJECT_KEY,
        entity: {
          $in: [GLOBAL_ENTITY, ...entity]
        },
        key,
        locale: lang
      })}`
    );

    const items = await this.fieldRepository.find({
      projectKey: PROJECT_KEY,
      entity: {
        $in: [GLOBAL_ENTITY, ...entity]
      },
      key,
      locale: lang
    });

    if (!items.length) throw new NotFoundException('Field Translation');

    return items[0];
  }

  async getEntityTranslation(
    entity: string,
    lang: string
  ): Promise<EntityTranslation> {
    this.logger.log(
      `Searching entity translation ${JSON.stringify({
        projectKey: PROJECT_KEY,
        key: entity,
        locale: lang
      })}`
    );
    const items = await this.entityRepository.find({
      projectKey: PROJECT_KEY,
      key: entity,
      locale: lang
    });

    if (!items.length) throw new NotFoundException('Entity Translation');

    return items[0];
  }
}
