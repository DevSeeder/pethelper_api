import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from '../generic.repository';
import {
  FieldTranslation,
  FieldTranslationDocument
} from 'src/microservice/domain/schemas/translations/field-translations.schema';

@Injectable()
export class FieldTranslationsRepository extends GenericRepository<FieldTranslation> {
  constructor(
    @InjectModel(FieldTranslation.name)
    model: Model<FieldTranslationDocument>
  ) {
    super(model);
  }
}
