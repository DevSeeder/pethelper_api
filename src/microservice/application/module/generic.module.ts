import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ErrorSchemasModule } from './configuration/error-schemas.module';
import { TranslationsModule } from './translation/translation.module';
import { EntitySchemasModule } from './configuration/entity-schemas.module';
import { FieldSchemasModule } from './configuration/field-schemas.module';
import { DependencyInjectorService } from '../injector/dependency-injector.service';
import { GenericRepository } from 'src/microservice/adapter/repository/generic.repository';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../service/translation/get-translation.service';
import { ErrorService } from '../service/configuration/error-schema/error.service';
import { DependecyTokens } from '../app.constants';
import { ModuleRef } from '@nestjs/core';
import { EntityModelTokenBuilder } from '../injector/entity/model-entity-token.injector';

@Module({})
export class GenericModule {
  static forFeature<Collection>(
    modelName: string,
    schema: any,
    entity: string
  ): DynamicModule {
    const repositoryProvider = DependencyInjectorService.injectRepository(
      entity,
      modelName
    );
    return {
      module: GenericModule,
      imports: [
        MongooseModule.forFeature(
          EntityModelTokenBuilder.buildMongooseStaticModelForFeature()
        ),
        EntitySchemasModule,
        FieldSchemasModule,
        ErrorSchemasModule,
        TranslationsModule
      ],
      providers: [
        repositoryProvider,
        GenericModule.loadServiceProvder(entity, 'get'),
        GenericModule.loadServiceProvder(entity, 'update'),
        GenericModule.loadServiceProvder(entity, 'create')
      ],
      exports: [
        repositoryProvider,
        `GENERIC_GET_SERVICE_${entity}`,
        `GENERIC_UPDATE_SERVICE_${entity}`,
        `GENERIC_CREATE_SERVICE_${entity}`
      ]
    };
  }

  static loadServiceProvder<Collection>(entity: string, providerKey: string) {
    const models = EntityModelTokenBuilder.buildMongooseModelTokens();
    return {
      provide: `GENERIC_${providerKey.toUpperCase()}_SERVICE_${entity}`,
      useFactory: async (
        moduleRef: ModuleRef,
        repository: GenericRepository<Collection>,
        fieldSchemaData: FieldSchema[],
        entitySchemaData: EntitySchema[],
        translationService: GetTranslationService,
        errorService: ErrorService
      ) => {
        const injectorService = new DependencyInjectorService(
          entitySchemaData,
          fieldSchemaData,
          translationService,
          errorService
        );
        const resolvedModels =
          await EntityModelTokenBuilder.buildMongooseModelInjector(moduleRef);
        const injectFunction = `inject${providerKey.capitalizeFirstLetter()}Service`;
        const serviceProvider = await injectorService[injectFunction](
          entity,
          repository,
          resolvedModels
        );
        return serviceProvider;
      },
      inject: [
        ModuleRef,
        `GENERIC_REPOSITORY_${entity}`,
        DependecyTokens.FIELD_SCHEMA_DB,
        DependecyTokens.ENTITY_SCHEMA_DB,
        GetTranslationService,
        ErrorService,
        ...models
      ]
    };
  }
}
