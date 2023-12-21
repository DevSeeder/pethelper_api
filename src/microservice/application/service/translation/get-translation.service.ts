import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { EntityTranslationsRepository } from 'src/microservice/adapter/repository/translations/entity-translations.repository';
import { FieldTranslationsRepository } from 'src/microservice/adapter/repository/translations/field-translations.repository';
import { FieldTranslation } from 'src/microservice/domain/schemas/translations/field-translations.schema';
import { DEFAULT_LANG, GLOBAL_ENTITY, PROJECT_KEY } from '../../app.constants';
import { NotFoundException } from '@devseeder/microservices-exceptions';
import { EntityTranslation } from 'src/microservice/domain/schemas/translations/entity-translations.schema';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class GetTranslationService extends AbstractService {
  constructor(
    protected readonly fieldRepository: FieldTranslationsRepository,
    protected readonly entityRepository: EntityTranslationsRepository,
    @Inject(REQUEST) private request: Request
  ) {
    super();
  }

  async getFieldTranslation(
    entity: string[],
    key: string
  ): Promise<FieldTranslation> {
    this.logger.log(
      `Searching Field Translation ${JSON.stringify({
        projectKey: PROJECT_KEY,
        entity: {
          $in: [GLOBAL_ENTITY, ...entity]
        },
        key,
        locale: this.getLang()
      })}`
    );

    const items = await this.fieldRepository.find({
      projectKey: PROJECT_KEY,
      entity: {
        $in: [GLOBAL_ENTITY, ...entity]
      },
      key,
      locale: this.getLang()
    });

    if (!items.length) throw new NotFoundException('Field Translation');

    return items[0];
  }

  async getEntityTranslation(entity: string): Promise<EntityTranslation> {
    this.logger.log(
      `Searching entity translation ${JSON.stringify({
        projectKey: PROJECT_KEY,
        key: entity,
        locale: this.getLang()
      })}`
    );
    const items = await this.entityRepository.find({
      projectKey: PROJECT_KEY,
      key: entity,
      locale: this.getLang()
    });

    if (!items.length) throw new NotFoundException('Entity Translation');

    return items[0];
  }

  getLang(): string {
    return this.request.headers['lang'] || DEFAULT_LANG;
  }
}
