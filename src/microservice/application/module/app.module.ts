import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../../../config/configuration';
import { PROJECT_KEY } from '../app.constants';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { CustomInterceptor } from 'src/core/custom.interceptor';
import { CustomJwtAuthGuard } from 'src/core/custom-jwt-auth.guard';
import { ModelEntityTokens } from 'src/microservice/domain/entity/model-entity-token.injector';
import { SCOPE_KEY } from 'src/microservice/domain/enum/enum-scopes.enum';
import { GenericModuleGenerator } from './generic-module.generator';

const moduleOptions = {
  authGuard: CustomJwtAuthGuard,
  interceptor: CustomInterceptor,
  configuration: configuration,
  modelTokens: ModelEntityTokens,
  projectKey: PROJECT_KEY,
  scopeKey: SCOPE_KEY
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
    ...GenericModuleGenerator.generateModules(moduleOptions)
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomInterceptor
    }
  ],
  exports: []
})
export class AppModule {}
