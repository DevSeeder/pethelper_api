import { Inject, Injectable, Scope } from '@nestjs/common';
import { ClientAuthService } from '../../../../adapter/repository/client/client-auth.service';
import { EnumScopes } from '../../../../domain/enum/enum-scopes.enum';
import { UserAuth } from '../../../../domain/model/auth/user-auth.model';
import { UserBodyDto } from '../../../../domain/model/dto/users/user.dto';
import { User } from '../../../../domain/schemas/entity/users.schema';
import { GenericCreateService } from '../../abstract/generic-create.service';
import { GenericRepository } from 'src/microservice/adapter/repository/generic.repository';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../../translation/get-translation.service';
import { ErrorService } from '../../configuration/error-schema/error.service';
import {
  DependencyEntityTokens,
  PROJECT_KEY
} from 'src/microservice/application/app.constants';
import { ObjectId } from 'mongoose';
import { REQUEST } from '@nestjs/core';

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
