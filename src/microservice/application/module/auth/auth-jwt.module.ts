import { JwtStrategy } from '@devseeder/nestjs-microservices-core';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { ClientAuthService } from 'src/microservice/adapter/repository/client/client-auth.service';
import { DIToken, PROJECT_KEY } from '../../app.constants';
import { SCOPE_KEY } from 'src/microservice/domain/enum/enum-scopes.enum';
import {
  EntitySchemasModule,
  ErrorSchemasModule,
  ErrorService
} from '@devseeder/nestjs-microservices-schemas';
import configuration from 'src/config/configuration';
import { CustomJwtAuthGuard } from 'src/core/custom-jwt-auth.guard';

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('auth.jwt.secret'),
        signOptions: {
          expiresIn: config.get<string>('auth.jwt.expires')
        }
      })
    }),
    EntitySchemasModule.forRoot(PROJECT_KEY),
    ErrorSchemasModule.forRoot(configuration, PROJECT_KEY)
  ],
  controllers: [],
  providers: [
    JwtService,
    JwtStrategy,
    {
      provide: ClientAuthService.name,
      useClass: ClientAuthService
    },
    {
      provide: DIToken.SCOPE_KEY,
      useValue: SCOPE_KEY
    },
    CustomJwtAuthGuard
  ],
  exports: [
    JwtService,
    JwtStrategy,
    CustomJwtAuthGuard,
    ClientAuthService.name,
    DIToken.SCOPE_KEY
  ]
})
export class AuthJwtModule {}
