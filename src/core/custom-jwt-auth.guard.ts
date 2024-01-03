import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {
  EntitySchema,
  ErrorService,
  SchemaDependecyTokens
} from '@devseeder/nestjs-microservices-schemas';
import { EntityJwtAuthGuard } from '@devseeder/nestjs-microservices-core';
import { DIToken } from 'src/microservice/application/app.constants';

@Injectable()
export class CustomJwtAuthGuard extends EntityJwtAuthGuard {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    @Inject(DIToken.SCOPE_KEY)
    protected readonly scopeKey: string,
    @Inject(SchemaDependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData: EntitySchema[],
    protected readonly errorService: ErrorService
  ) {
    super(
      reflector,
      jwtService,
      configService,
      scopeKey,
      entitySchemaData,
      errorService
    );
  }
}
