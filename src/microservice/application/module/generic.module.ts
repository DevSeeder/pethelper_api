import { Module, DynamicModule, Provider } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from 'src/microservice/adapter/repository/generic.repository';
import { GenericGetService } from '../service/abstract/generic-get.service';
import { Search } from '../dto/search/search.dto';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../service/translation/get-translation.service';
import { ErrorService } from '../service/configuration/error-schema/error.service';
import { DependecyTokens } from '../app.constants';
import { ErrorSchemasModule } from './configuration/error-schemas.module';
import { TranslationsModule } from './translation/translation.module';
import { EntitySchemasModule } from './configuration/entity-schemas.module';
import { FieldSchemasModule } from './configuration/field-schemas.module';
import { GenericUpdateService } from '../service/abstract/generic-update.service';
import { AbstractBodyDto } from '../dto/body/abtract-body.dto';

@Module({})
export class GenericModule {
  static forFeature<Collection>(
    modelName: string,
    schema: any,
    entity: string
  ): DynamicModule {
    const repositoryProvider: Provider = {
      provide: `GENERIC_REPOSITORY_${entity}`,
      useFactory: (model: Model<any>) =>
        new GenericRepository<Collection>(model),
      inject: [getModelToken(modelName)]
    };

    const getServiceProvider: Provider = {
      provide: `GENERIC_GET_SERVICE_${entity}`,
      useFactory: (
        repository: GenericRepository<Collection>,
        fieldSchemaData: FieldSchema[],
        entitySchemaData: EntitySchema[],
        translationService?: GetTranslationService,
        errorService?: ErrorService
      ) => {
        return new GenericGetService<Collection, Collection & Document, Search>(
          repository,
          entity,
          fieldSchemaData,
          entitySchemaData,
          translationService,
          errorService
        );
      },
      inject: [
        `GENERIC_REPOSITORY_${entity}`,
        DependecyTokens.FIELD_SCHEMA_DB,
        DependecyTokens.ENTITY_SCHEMA_DB,
        GetTranslationService,
        ErrorService
      ]
    };

    const updateServiceProvider: Provider = {
      provide: `GENERIC_UPDATE_SERVICE_${entity}`,
      useFactory: (
        repository: GenericRepository<Collection>,
        fieldSchemaData: FieldSchema[],
        entitySchemaData: EntitySchema[],
        translationService?: GetTranslationService,
        errorService?: ErrorService
      ) => {
        return new GenericUpdateService<
          Collection,
          Collection & Document,
          Search,
          AbstractBodyDto
        >(
          repository,
          entity,
          fieldSchemaData,
          entitySchemaData,
          translationService,
          errorService
        );
      },
      inject: [
        `GENERIC_REPOSITORY_${entity}`,
        DependecyTokens.FIELD_SCHEMA_DB,
        DependecyTokens.ENTITY_SCHEMA_DB,
        GetTranslationService,
        ErrorService
      ]
    };

    return {
      module: GenericModule,
      imports: [
        MongooseModule.forFeature([{ name: modelName, schema }]),
        EntitySchemasModule,
        FieldSchemasModule,
        ErrorSchemasModule,
        TranslationsModule
      ],
      providers: [
        repositoryProvider,
        getServiceProvider,
        updateServiceProvider
      ],
      exports: [repositoryProvider, getServiceProvider, updateServiceProvider]
    };
  }
}
