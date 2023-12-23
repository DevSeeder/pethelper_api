import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FieldTranslationsRepository } from 'src/microservice/adapter/repository/translations/field-translations.repository';
import {
  FieldTranslation,
  FieldTranslationsSchema
} from 'src/microservice/domain/schemas/translations/field-translations.schema';
import { GetTranslationService } from '../../service/translation/get-translation.service';
import {
  EntityTranslation,
  EntityTranslationsSchema
} from 'src/microservice/domain/schemas/translations/entity-translations.schema';
import { EntityTranslationsRepository } from 'src/microservice/adapter/repository/translations/entity-translations.repository';
import {
  ServiceKeyTranslation,
  ServiceKeyTranslationsSchema
} from 'src/microservice/domain/schemas/translations/service-key-translations.schema';
import { ServiceKeyTranslationsRepository } from 'src/microservice/adapter/repository/translations/service-key-translations.repository';
import { GetServiceKeyTranslationService } from '../../service/translation/service-key/get-service-key-translations.service';
import { DependecyTokens } from '../../app.constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FieldTranslation.name, schema: FieldTranslationsSchema },
      { name: EntityTranslation.name, schema: EntityTranslationsSchema },
      { name: ServiceKeyTranslation.name, schema: ServiceKeyTranslationsSchema }
    ])
  ],
  controllers: [],
  providers: [
    FieldTranslationsRepository,
    EntityTranslationsRepository,
    ServiceKeyTranslationsRepository,
    GetTranslationService,
    GetServiceKeyTranslationService,
    {
      provide: DependecyTokens.SERVICE_KEY_TRANSLATION_DB,
      useFactory: async (dataService: GetServiceKeyTranslationService) => {
        return await dataService.getAll(); // Método que busca os dados no banco
      },
      inject: [GetServiceKeyTranslationService]
    }
  ],
  exports: [
    FieldTranslationsRepository,
    EntityTranslationsRepository,
    ServiceKeyTranslationsRepository,
    GetTranslationService,
    GetServiceKeyTranslationService,
    DependecyTokens.SERVICE_KEY_TRANSLATION_DB
  ]
})
export class TranslationsModule {}
