import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import {
  FieldTranslation,
  FieldTranslationDocument
} from 'src/microservice/domain/schemas/translations/field-translations.schema';

@Injectable()
export class FieldTranslationsRepository extends AbstractRepository<
  FieldTranslation,
  FieldTranslationDocument
> {
  constructor(
    @InjectModel(FieldTranslation.name)
    model: Model<FieldTranslationDocument>
  ) {
    super(model);
  }
}
