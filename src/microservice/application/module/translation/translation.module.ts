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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FieldTranslation.name, schema: FieldTranslationsSchema },
      { name: EntityTranslation.name, schema: EntityTranslationsSchema }
    ])
  ],
  controllers: [],
  providers: [
    FieldTranslationsRepository,
    EntityTranslationsRepository,
    GetTranslationService
  ],
  exports: [
    FieldTranslationsRepository,
    EntityTranslationsRepository,
    GetTranslationService
  ]
})
export class TranslationsModule {}
