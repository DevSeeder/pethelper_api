import { Module, DynamicModule, Provider } from '@nestjs/common';
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
import { CustomProvider } from '../dto/provider/custom-provider.dto';

@Module({})
export class GenericModule {
  static forFeature<Collection>(
    modelName: string,
    entity: string,
    customProvider?: CustomProvider
  ): DynamicModule {
    const repositoryProvider = DependencyInjectorService.injectRepository(
      entity,
      modelName,
      customProvider
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
        GenericModule.loadServiceProvider(entity, 'get', customProvider),
        GenericModule.loadServiceProvider(entity, 'update', customProvider),
        GenericModule.loadServiceProvider(entity, 'create', customProvider)
      ],
      exports: [
        repositoryProvider,
        `GENERIC_GET_SERVICE_${entity}`,
        `GENERIC_UPDATE_SERVICE_${entity}`,
        `GENERIC_CREATE_SERVICE_${entity}`
      ]
    };
  }

  static loadServiceProvider<Collection>(
    entity: string,
    providerKey: string,
    customProvider?: CustomProvider
  ) {
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
          moduleRef,
          entitySchemaData,
          fieldSchemaData,
          translationService,
          errorService
        );
        const injectFunction = `inject${providerKey.capitalizeFirstLetter()}Service`;
        const serviceProvider = await injectorService[injectFunction](
          entity,
          repository,
          customProvider
        );
        return serviceProvider;
      },
      inject: [
        ModuleRef,
        `GENERIC_REPOSITORY_${entity}`,
        DependecyTokens.FIELD_SCHEMA_DB,
        DependecyTokens.ENTITY_SCHEMA_DB,
        GetTranslationService,
        ErrorService
      ]
    };
  }
}

const getCustomProvider = function (
  service: any,
  entity: string,
  provideKey: string
): Provider {
  return {
    provide: `GENERIC_${provideKey.toUpperCase()}_SERVICE_${entity}`,
    useClass: service
  };
};
