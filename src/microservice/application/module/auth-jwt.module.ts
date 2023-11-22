import { JwtStrategy } from '@devseeder/nestjs-microservices-core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
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
  providers: [JwtService, JwtStrategy],
  exports: [JwtService, JwtStrategy]
})
export class AuthJwtModule {}
