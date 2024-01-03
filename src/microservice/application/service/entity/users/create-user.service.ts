import { Inject, Injectable, Scope } from '@nestjs/common';
import { ClientAuthService } from '../../../../adapter/repository/client/client-auth.service';
import { EnumScopes } from '../../../../domain/enum/enum-scopes.enum';
import { UserAuth } from '../../../../domain/model/auth/user-auth.model';
import { UserBodyDto } from '../../../../domain/model/dto/users/user.dto';
import { User } from '../../../../domain/schemas/entity/users.schema';
import {
  ErrorService,
  GetTranslationService
} from '@devseeder/nestjs-microservices-schemas';
import {
  DIToken,
  DependencyEntityTokens,
  PROJECT_KEY
} from 'src/microservice/application/app.constants';
import { ObjectId } from 'mongoose';
import { REQUEST } from '@nestjs/core';
import {
  EntitySchema,
  FieldSchema
} from '@devseeder/nestjs-microservices-schemas';
import {
  GenericCreateService,
  GenericRepository
} from '@devseeder/nestjs-microservices-commons';

@Injectable({ scope: Scope.REQUEST })
export class CreateUserService extends GenericCreateService<
  User,
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
    @Inject(DIToken.SCOPE_KEY)
    protected readonly scopeKey?: string,
    protected readonly clientAuthService?: ClientAuthService
  ) {
    super(
      repository,
      DependencyEntityTokens.USER,
      fieldSchemaData,
      entitySchemaData,
      translationService,
      errorService,
      request
    );
  }

  async create(body: UserBodyDto): Promise<{ _id: ObjectId }> {
    const userAuthId = await this.createUserAuth(body);
    return super.create({ ...body, idUserAuth: userAuthId });
  }

  async createUserAuth(user: UserBodyDto): Promise<string> {
    const userAuth = new UserAuth();
    userAuth.name = user.name;
    userAuth.username = user.username;
    userAuth.password = user.password;
    userAuth.projectKey = PROJECT_KEY;
    userAuth.scopes = [EnumScopes.USER, EnumScopes.UPDATE_PASSWORD];

    const response = await this.clientAuthService.createUser(userAuth);
    return response.response.userId;
  }
}
