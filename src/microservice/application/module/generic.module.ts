import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DependencyInjectorService } from '../injector/dependency-injector.service';
import {
  ErrorSchemasModule,
  ErrorService,
  GetTranslationService,
  SchemaDependecyTokens,
  TranslationsModule
} from '@devseeder/nestjs-microservices-schemas';
import { DIToken, PROJECT_KEY } from '../app.constants';
import { ModuleRef, REQUEST, Reflector } from '@nestjs/core';
import { EntityModelTokenBuilder } from '../injector/entity/model-entity-token.injector';
import {
  EntitySchema,
  FieldSchema,
  SchemasModule
} from '@devseeder/nestjs-microservices-schemas';
import configuration from 'src/config/configuration';
import {
  CustomProvider,
  GenericCreateController,
  GenericGetController,
  GenericRepository,
  GenericUpdateController
} from '@devseeder/nestjs-microservices-commons';
import { SCOPE_KEY } from 'src/microservice/domain/enum/enum-scopes.enum';
import { MyJwtAuthGuard } from 'src/core/my-jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { MetaDataInterceptor } from 'src/core/meta-data.interceptor';

const authGuard = MyJwtAuthGuard;
const interceptor = MetaDataInterceptor;

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
        SchemasModule.forRootAsync(configuration, PROJECT_KEY),
        TranslationsModule.forRoot(configuration, PROJECT_KEY),
        ErrorSchemasModule.forRoot(configuration, PROJECT_KEY)
      ],
      providers: [
        repositoryProvider,
        JwtService,
        {
          provide: DIToken.SCOPE_KEY,
          useValue: SCOPE_KEY
        },
        MyJwtAuthGuard,
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
        request: Request,
        scopeKey: string
      ) => {
        const injectorService = new DependencyInjectorService(
          moduleRef,
          entitySchemaData,
          fieldSchemaData,
          translationService,
          errorService,
          request,
          scopeKey
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
        SchemaDependecyTokens.FIELD_SCHEMA_DB,
        SchemaDependecyTokens.ENTITY_SCHEMA_DB,
        GetTranslationService,
        ErrorService,
        REQUEST,
        DIToken.SCOPE_KEY
      ]
    };
  }
}

function controllersFactory(entity: string, customProvider?: CustomProvider) {
  const genericArr = [
    GenericGetController({ entity, authGuard, interceptor }),
    GenericUpdateController({ entity, authGuard, interceptor }),
    GenericCreateController({ entity, authGuard, interceptor })
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
