import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import {
  ServiceKeyTranslation,
  ServiceKeyTranslationDocument
} from 'src/microservice/domain/schemas/translations/service-key-translations.schema';

@Injectable()
export class ServiceKeyTranslationsRepository extends AbstractRepository<
  ServiceKeyTranslation,
  ServiceKeyTranslationDocument
> {
  constructor(
    @InjectModel(ServiceKeyTranslation.name)
    model: Model<ServiceKeyTranslationDocument>
  ) {
    super(model);
  }
}
