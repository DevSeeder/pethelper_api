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
import { User, UserDocument } from '../../domain/schemas/users.schema';
// import { UpdateUserService } from '../../application/service/entity/users/update-user-auth.service';
import { UpdateUserDTO, UserDTO } from '../../domain/model/dto/users/user.dto';
import { CreateUserService } from '../../application/service/entity/users/create-user.service';
import { Scopes } from '@devseeder/nestjs-microservices-core';
import { GetUser } from '../../domain/decorators/get-user.decorator';
import { AbstractController } from './abstract.controller';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { AbstractBodyDto } from 'src/microservice/application/dto/body/abtract-body.dto';
import { GetUserService } from 'src/microservice/application/service/entity/users/get-user.service';
import { UpdateUserService } from 'src/microservice/application/service/entity/users/update-user.service';
import { GetFieldSchemaService } from 'src/microservice/application/service/configuration/field-schemas/get-field-schemas.service';
import { FieldSchema } from 'src/microservice/domain/schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';

@Controller('users')
export class UsersController extends AbstractController<
  User,
  UserDocument,
  User,
  Search,
  AbstractBodyDto
> {
  constructor(
    protected readonly getUsersService: GetUserService,
    protected readonly updateUserService: UpdateUserService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(
      'User',
      ['users'],
      '',
      [
        'create',
        'cloneById',
        'cloneManyByIds',
        'activate',
        'inactivate',
        'updateBy',
        'searchBy'
      ],
      getUsersService,
      updateUserService,
      null,
      fieldSchemaData
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
