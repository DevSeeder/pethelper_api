import { Inject, Injectable, Scope } from '@nestjs/common';
import {
  ErrorService,
  GetTranslationService
} from '@devseeder/nestjs-microservices-schemas';
import { REQUEST } from '@nestjs/core';
import {
  EntitySchema,
  FieldSchema
} from '@devseeder/nestjs-microservices-schemas';
import {
  GenericRepository,
  GenericCreateUserService
} from '@devseeder/nestjs-microservices-commons';
import { User } from 'src/microservice/domain/schemas/users.schema';
import { UserBodyDto } from '@devseeder/nestjs-microservices-core/dist/dto/user.dto';
import { ClientAuthService } from '@devseeder/nestjs-microservices-core';
import { DIToken, PROJECT_KEY } from '../../app.constants';

@Injectable({ scope: Scope.REQUEST })
export class CreateUserService extends GenericCreateUserService<
  User,
  UserBodyDto
> {
  constructor(
    protected readonly repository: GenericRepository<User>,
    protected readonly fieldSchemaData: FieldSchema[],
    protected readonly entitySchemaData: EntitySchema[],
    protected readonly translationService: GetTranslationService,
    protected readonly errorService: ErrorService,
    @Inject(REQUEST) protected readonly request?: Request,
    @Inject(DIToken.SCOPE_KEY) protected readonly scopeKey?: string,
    protected readonly clientAuthService?: ClientAuthService
  ) {
    super(
      repository,
      fieldSchemaData,
      entitySchemaData,
      translationService,
      errorService,
      request,
      scopeKey,
      clientAuthService,
      PROJECT_KEY
    );
  }
}
