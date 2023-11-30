import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateUserService } from '../../service/entity/users/create-user.service';
import { User, UsersSchema } from '../../../domain/schemas/users.schema';
import { UsersRepository } from '../../../adapter/repository/users.repository';
import { ClientAuthService } from '../../../adapter/repository/client/client-auth.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../../config/configuration';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from '../../../adapter/controller/users.controller';
import { GetUserValidationService } from '../../service/entity/users/get-user-validation.service';
import { UpdateUserService } from '../../service/entity/users/update-user.service';
import { AuthJwtModule } from '../auth/auth-jwt.module';
import { GetUserService } from '../../service/entity/users/get-user.service';
import { FieldSchemasModule } from '../configuration/field-schemas.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   load: [configuration]
    // }),
    // AuthJwtModule,
    // HttpModule,
    FieldSchemasModule
  ],
  controllers: [
    // UsersController
  ],
  providers: [
    UsersRepository,
    GetUserService
    // CreateUserService,
    // ClientAuthService,
    // GetUserValidationService,
    // UpdateUserService
  ],
  exports: [GetUserService]
})
export class UsersModule {}
