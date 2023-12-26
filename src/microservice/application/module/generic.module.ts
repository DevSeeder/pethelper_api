import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorSchemasModule } from './configuration/error-schemas.module';
import { TranslationsModule } from './translation/translation.module';
import { EntitySchemasModule } from './configuration/entity-schemas.module';
import { FieldSchemasModule } from './configuration/field-schemas.module';
import { DependencyInjectorService } from '../injector/dependency-injector.service';

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
    const getServiceProvider =
      DependencyInjectorService.injectGetService(entity);
    const updateServiceProvider =
      DependencyInjectorService.injectUpdateService(entity);
    const createServiceProvider =
      DependencyInjectorService.injectCreateService(entity);

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
        updateServiceProvider,
        createServiceProvider
      ],
      exports: [
        repositoryProvider,
        getServiceProvider,
        updateServiceProvider,
        createServiceProvider
      ]
    };
  }
}
