import { JwtStrategy } from '@devseeder/nestjs-microservices-core';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { ClientAuthService } from 'src/microservice/adapter/repository/client/client-auth.service';

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
    })
  ],
  controllers: [],
  providers: [
    JwtService,
    JwtStrategy,
    {
      provide: ClientAuthService.name,
      useClass: ClientAuthService
    }
  ],
  exports: [JwtService, JwtStrategy, ClientAuthService.name]
})
export class AuthJwtModule {}
