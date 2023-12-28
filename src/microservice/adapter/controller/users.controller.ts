import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import { MyJwtAuthGuard } from '../../../core/auth/jwt.auth';
import { EnumScopes } from '../../domain/enum/enum-scopes.enum';
import { User, UserDocument } from '../../domain/schemas/entity/users.schema';
// import { UpdateUserService } from '../../application/service/entity/users/update-user-auth.service';
import { UpdateUserDTO, UserDTO } from '../../domain/model/dto/users/user.dto';
import { CreateUserService } from '../../application/service/entity/users/create-user.service';
import { Scopes } from '@devseeder/nestjs-microservices-core';
import { GetUser } from '../../domain/decorators/get-user.decorator';
import { AbstractController } from './abstract.controller';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { AbstractBodyDto } from 'src/microservice/application/dto/body/abtract-body.dto';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import {
  DependecyTokens,
  DependencyEntityTokens
} from 'src/microservice/application/app.constants';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';
import { GenericGetService } from 'src/microservice/application/service/abstract/generic-get.service';
import { GenericUpdateService } from 'src/microservice/application/service/abstract/generic-update.service';

@Controller('users')
export class UsersController extends AbstractController<
  User,
  User,
  Search,
  AbstractBodyDto
> {
  constructor(
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.USER}`)
    readonly getUsersService: GenericGetService<User, User, Search>,
    @Inject(`GENERIC_UPDATE_SERVICE_${DependencyEntityTokens.USER}`)
    readonly updateUserService: GenericUpdateService<
      User,
      User,
      Search,
      AbstractBodyDto
    >,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    readonly fieldSchemaData?: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    readonly entitySchemaData?: EntitySchema[],
    readonly errorService?: ErrorService,
    readonly translationService?: GetTranslationService
  ) {
    super(
      'users',
      getUsersService,
      updateUserService,
      null,
      fieldSchemaData,
      entitySchemaData,
      errorService,
      translationService
    );
  }

  // @Post('/create')
  // createUser(@Body() user: UserDTO): Promise<any> {
  //   return this.createUserService.createUser(user);
  // }

  // @UseGuards(MyJwtAuthGuard)
  // @Scopes(EnumScopes.USER)
  // @Get('/details/:id')
  // getUserById(@Param('id') id: number): Promise<User> {
  //   return this.getUserService.getUserById(id);
  // }

  // @UseGuards(MyJwtAuthGuard)
  // @Scopes(EnumScopes.USER)
  // @Get('/search/:name')
  // getUser(@Param('name') name: string): Promise<User[]> {
  //   return this.getUserService.searchUserByUsername(name);
  // }

  // @UseGuards(MyJwtAuthGuard)
  // @Scopes(EnumScopes.USER)
  // @Get('/email/:username')
  // getUserByUsername(@Param('username') username: string): Promise<User> {
  //   return this.getUserService.getUserByEmail(username);
  // }

  // @UseGuards(MyJwtAuthGuard)
  // @Scopes(EnumScopes.USER)
  // @Post('/update/:id')
  // updateUserName(
  //   @Param('id') id: number,
  //   @Body() user: UpdateUserDTO,
  //   @GetUser() username: string
  // ): Promise<void> {
  //   return this.updateUserService.updateUserName(id, user, username);
  // }

  // @UseGuards(MyJwtAuthGuard)
  // @Scopes(EnumScopes.USER)
  // @Post('/inactivate/:id')
  // inactivateUser(
  //   @Param('id') id: number,
  //   @GetUser() username: string
  // ): Promise<void> {
  //   return this.updateUserService.updateInactivateUser(id, username);
  // }
}
