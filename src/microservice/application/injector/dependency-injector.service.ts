import { Inject, Injectable, Provider } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from 'src/microservice/adapter/repository/generic.repository';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { GetTranslationService } from '../service/translation/get-translation.service';
import { ErrorService } from '../service/configuration/error-schema/error.service';
import { GenericGetService } from '../service/abstract/generic-get.service';
import { Search } from '@devseeder/nestjs-microservices-commons/dist/dto/search.dto';
import { DependecyTokens, GLOBAL_ENTITY } from '../app.constants';
import { GenericUpdateService } from '../service/abstract/generic-update.service';
import { AbstractBodyDto } from '../dto/body/abtract-body.dto';
import { GenericCreateService } from '../service/abstract/generic-create.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class DependencyInjectorService {
  private entitySchema: EntitySchema;
  private parentFields: FieldSchema[];
  constructor(
    @Inject(DependecyTokens.ERROR_SCHEMA_DB)
    private entitySchemaData: EntitySchema[],
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    private fieldSchemaData: FieldSchema[],
    private translationService?: GetTranslationService,
    private errorService?: ErrorService
  ) {}

  setSchema(entity: string) {
    this.entitySchema = this.entitySchemaData.filter(
      (ent) => ent.entity === entity
    )[0];
    this.parentFields = this.fieldSchemaData
      .filter(
        (field) =>
          field.entity === entity ||
          field.entity === GLOBAL_ENTITY ||
          (this.entitySchema.extendedEntities &&
            this.entitySchema.extendedEntities.includes(field.entity))
      )
      .filter((field) => field.type === 'externalId');
  }

  static injectRepository<Collection>(
    entity: string,
    modelName: string
  ): Provider {
    return {
      provide: `GENERIC_REPOSITORY_${entity}`,
      useFactory: (model: Model<any>) =>
        new GenericRepository<Collection>(model),
      inject: [getModelToken(modelName)]
    };
  }

  injectGetService<Collection>(
    entity: string,
    repository: GenericRepository<any>,
    modelExt: any
  ): GenericGetService<Collection, Collection, Search> {
    this.setSchema(entity);

    const service = new GenericGetService<
      Collection,
      Collection & Document,
      Search
    >(
      repository,
      entity,
      this.fieldSchemaData,
      this.entitySchemaData,
      this.translationService,
      this.errorService
    );

    for (const parent of this.parentFields) {
      const relation = parent.externalRelation.service;
      const relModel = modelExt[relation];
      const relRepository = new GenericRepository<Collection>(relModel);
      const relProvider = this.injectGetService(relation, relRepository, {});
      service[`get${relation.capitalizeFirstLetter()}Service`] = relProvider;
    }

    return service;
  }

  injectUpdateService<Collection>(
    entity: string,
    repository: GenericRepository<any>,
    modelExt: any
  ): GenericUpdateService<
    Collection,
    Collection & Document,
    Search,
    AbstractBodyDto
  > {
    this.setSchema(entity);

    const service = new GenericUpdateService<
      Collection,
      Collection & Document,
      Search,
      AbstractBodyDto
    >(
      repository,
      entity,
      this.fieldSchemaData,
      this.entitySchemaData,
      this.translationService,
      this.errorService
    );

    for (const parent of this.parentFields) {
      const relation = parent.externalRelation.service;
      const relModel = modelExt[relation];
      const relRepository = new GenericRepository<Collection>(relModel);
      const relProvider = this.injectGetService(relation, relRepository, {});
      service[`get${relation.capitalizeFirstLetter()}Service`] = relProvider;
    }

    return service;
  }

  injectCreateService<Collection>(
    entity: string,
    repository: GenericRepository<any>,
    modelExt: any
  ): GenericCreateService<Collection, Collection & Document, AbstractBodyDto> {
    this.setSchema(entity);

    const service = new GenericCreateService<
      Collection,
      Collection & Document,
      AbstractBodyDto
    >(
      repository,
      entity,
      this.fieldSchemaData,
      this.entitySchemaData,
      this.translationService,
      this.errorService
    );

    for (const parent of this.parentFields) {
      const relation = parent.externalRelation.service;
      const relModel = modelExt[relation];
      const relRepository = new GenericRepository<Collection>(relModel);
      const relProvider = this.injectGetService(relation, relRepository, {});
      service[`get${relation.capitalizeFirstLetter()}Service`] = relProvider;
    }

    return service;
  }
}
