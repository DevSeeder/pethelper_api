import { Injectable, Provider } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from 'src/microservice/adapter/repository/generic.repository';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { GetTranslationService } from '../service/translation/get-translation.service';
import { ErrorService } from '../service/configuration/error-schema/error.service';
import { GenericGetService } from '../service/abstract/generic-get.service';
import { Search } from '@devseeder/nestjs-microservices-commons/dist/dto/search.dto';
import { DependecyTokens } from '../app.constants';
import { GenericUpdateService } from '../service/abstract/generic-update.service';
import { AbstractBodyDto } from '../dto/body/abtract-body.dto';
import { GenericCreateService } from '../service/abstract/generic-create.service';

@Injectable()
export class DependencyInjectorService {
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

  static injectGetService<Collection>(entity: string): Provider {
    return {
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
  }

  static injectUpdateService<Collection>(entity: string): Provider {
    return {
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
  }

  static injectCreateService<Collection>(entity: string): Provider {
    return {
      provide: `GENERIC_CREATE_SERVICE_${entity}`,
      useFactory: (
        repository: GenericRepository<Collection>,
        fieldSchemaData: FieldSchema[],
        entitySchemaData: EntitySchema[],
        translationService?: GetTranslationService,
        errorService?: ErrorService
      ) => {
        return new GenericCreateService<
          Collection,
          Collection,
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
  }
}
