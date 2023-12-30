import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorSchemasModule } from './configuration/error-schemas.module';
import { DependencyInjectorService } from '../injector/dependency-injector.service';
import { GenericRepository } from 'src/microservice/adapter/repository/generic.repository';
import {
  GetTranslationService,
  TranslationsModule
} from '@devseeder/nestjs-microservices-schemas';
import { ErrorService } from '../service/configuration/error-schema/error.service';
import { DependecyTokens, PROJECT_KEY } from '../app.constants';
import { ModuleRef, REQUEST } from '@nestjs/core';
import { EntityModelTokenBuilder } from '../injector/entity/model-entity-token.injector';
import { CustomProvider } from '../dto/provider/custom-provider.dto';
import { GenericGetController } from 'src/microservice/adapter/controller/generic/generic-get.controller';
import { GenericUpdateController } from 'src/microservice/adapter/controller/generic/generic-update.controller';
import { GenericCreateController } from 'src/microservice/adapter/controller/generic/generic-create.controller';
import { AuthJwtModule } from './auth/auth-jwt.module';
import {
  EntitySchema,
  FieldSchema,
  SchemasModule
} from '@devseeder/nestjs-microservices-schemas';
import configuration from 'src/config/configuration';

@Module({})
export class GenericModule {
  static forFeature(
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
      controllers: controllersFactory(entity, customProvider),
      imports: [
        MongooseModule.forFeature(
          EntityModelTokenBuilder.buildMongooseStaticModelForFeature()
        ),
        SchemasModule.forRootAync(configuration, PROJECT_KEY),
        TranslationsModule.forRoot(PROJECT_KEY),
        ErrorSchemasModule,
        AuthJwtModule
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
        errorService: ErrorService,
        request: Request
      ) => {
        const injectorService = new DependencyInjectorService(
          moduleRef,
          entitySchemaData,
          fieldSchemaData,
          translationService,
          errorService,
          request
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
        ErrorService,
        REQUEST
      ]
    };
  }
}

function controllersFactory(entity: string, customProvider?: CustomProvider) {
  const genericArr = [
    GenericGetController({ entity }),
    GenericUpdateController({ entity }),
    GenericCreateController({ entity })
  ];

  if (checkCustomController('get', customProvider))
    genericArr.push(customProvider.controller.get);
  if (checkCustomController('update', customProvider))
    genericArr.push(customProvider.controller.update);
  if (checkCustomController('create', customProvider))
    genericArr.push(customProvider.controller.get);

  return genericArr;
}

function checkCustomController(
  ctrlKey: string,
  customProvider?: CustomProvider
): boolean {
  return (
    customProvider &&
    customProvider.controller &&
    customProvider.controller[ctrlKey]
  );
}
