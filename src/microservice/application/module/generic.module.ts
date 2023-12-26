import { Module, DynamicModule, Provider } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from 'src/microservice/adapter/repository/generic.repository';

@Module({})
export class GenericModule {
  static forFeature<Collection, CollectionDocument>(
    modelName: string,
    schema: any
  ): DynamicModule {
    const repositoryProvider: Provider = {
      provide: `GENERIC_REPOSITORY_${modelName}`,
      useFactory: (model: Model<any>) =>
        new GenericRepository<Collection>(model),
      inject: [getModelToken(modelName)]
    };

    return {
      module: GenericModule,
      imports: [MongooseModule.forFeature([{ name: modelName, schema }])],
      providers: [repositoryProvider],
      exports: [repositoryProvider]
    };
  }
}
