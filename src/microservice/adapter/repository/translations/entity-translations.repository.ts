import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from '../generic.repository';
import {
  EntityTranslation,
  EntityTranslationDocument
} from 'src/microservice/domain/schemas/translations/entity-translations.schema';

@Injectable()
export class EntityTranslationsRepository extends GenericRepository<EntityTranslation> {
  constructor(
    @InjectModel(EntityTranslation.name)
    model: Model<EntityTranslationDocument>
  ) {
    super(model);
  }
}
