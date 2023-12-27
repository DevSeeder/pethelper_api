import { Inject, Injectable, Provider } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Collection, Model } from 'mongoose';
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
import { CustomProvider } from '../dto/provider/custom-provider.dto';
import { ModelEntityTokens } from './entity/model-entity-token.injector';

@Injectable()
export class DependencyInjectorService {
  private entitySchema: EntitySchema;
  private parentFields: FieldSchema[];
  constructor(
    private moduleRef: ModuleRef,
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

  injectService<Collection, T>(
    entity: string,
    repository: GenericRepository<any>,
    genericClass,
    providerKey: string,
    customProvider?: CustomProvider
  ): T {
    this.setSchema(entity);

    const { args, classService } = this.getInstance(
      entity,
      repository,
      genericClass,
      providerKey,
      customProvider
    );
    const service = createInstance<any>(classService, ...args);

    for (const parent of this.parentFields) {
      const relation = parent.externalRelation.service;
      // const relModel = modelExt[relation];
      const relModel = this.moduleRef.get(
        getModelToken(ModelEntityTokens[relation].modelName),
        {
          strict: false
        }
      );
      const relRepository = new GenericRepository<Collection>(relModel);
      const relProvider = this.injectGetService(relation, relRepository);
      service[`get${relation.capitalizeFirstLetter()}Service`] = relProvider;
    }
    return service;
  }

  injectGetService<Collection>(
    entity: string,
    repository: GenericRepository<any>,
    customProvider?: CustomProvider
  ): GenericGetService<Collection, Collection, Search> {
    return this.injectService(
      entity,
      repository,
      GenericGetService<Collection, Collection, Search>,
      'get',
      customProvider
    );
  }

  injectUpdateService<Collection>(
    entity: string,
    repository: GenericRepository<any>,
    customProvider?: CustomProvider
  ): GenericUpdateService<
    Collection,
    Collection & Document,
    Search,
    AbstractBodyDto
  > {
    return this.injectService(
      entity,
      repository,
      GenericUpdateService<
        Collection,
        Collection & Document,
        Search,
        AbstractBodyDto
      >,
      'update',
      customProvider
    );
  }

  injectCreateService<Collection>(
    entity: string,
    repository: GenericRepository<any>,
    customProvider?: CustomProvider
  ): GenericCreateService<Collection, Collection & Document, AbstractBodyDto> {
    return this.injectService(
      entity,
      repository,
      GenericCreateService<Collection, Collection & Document, AbstractBodyDto>,
      'create',
      customProvider
    );
  }

  private getInstance(
    entity: string,
    repository: GenericRepository<Collection>,
    genericClass,
    providerKey: string,
    customProvider?: CustomProvider
  ): { args: any[]; classService } {
    let classService = genericClass;
    let args = [
      repository,
      entity,
      this.fieldSchemaData,
      this.entitySchemaData,
      this.translationService,
      this.errorService
    ];

    if (customProvider && customProvider[providerKey]) {
      classService = customProvider[providerKey];
      args = [
        repository,
        this.fieldSchemaData,
        this.entitySchemaData,
        this.translationService,
        this.errorService
      ];
    }

    return { args, classService };
  }
}

function createInstance<T>(
  classReference: { new (...args: any[]): T },
  ...args: any[]
): T {
  return new classReference(...args);
}
