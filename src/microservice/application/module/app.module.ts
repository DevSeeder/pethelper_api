import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../../../config/configuration';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomJwtAuthGuard } from 'src/core/custom-jwt-auth.guard';
import { EntitySetupConfig } from 'src/microservice/domain/setup/entity-stup.injector';
import {
  GeneratorModuleOptions,
  GenericModuleGenerator
} from '@devseeder/nestjs-microservices-commons';
import { MetaDataInterceptor } from '@devseeder/nestjs-microservices-core';

const moduleOptions = {
  authGuard: CustomJwtAuthGuard,
  interceptor: MetaDataInterceptor,
  configuration: configuration,
  modelTokens: EntitySetupConfig
};

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('database.mongodb.connection')
      })
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    ...GenericModuleGenerator.generateModules(
      moduleOptions as GeneratorModuleOptions
    )
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MetaDataInterceptor
    }
  ],
  exports: []
})
export class AppModule {}
