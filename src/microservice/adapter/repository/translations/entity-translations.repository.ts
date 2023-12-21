import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import {
  EntityTranslation,
  EntityTranslationDocument
} from 'src/microservice/domain/schemas/translations/entity-translations.schema';

@Injectable()
export class EntityTranslationsRepository extends AbstractRepository<
  EntityTranslation,
  EntityTranslationDocument
> {
  constructor(
    @InjectModel(EntityTranslation.name)
    model: Model<EntityTranslationDocument>
  ) {
    super(model);
  }
}
