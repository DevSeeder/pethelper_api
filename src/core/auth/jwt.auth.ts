import { CustomJwtAuthGuard } from '@devseeder/nestjs-microservices-core';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { EnumScopes } from '../../microservice/domain/enum/enum-scopes.enum';

@Injectable()
export class MyJwtAuthGuard extends CustomJwtAuthGuard {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService
  ) {
    super(reflector, jwtService, configService, EnumScopes.ADM);
  }
}
