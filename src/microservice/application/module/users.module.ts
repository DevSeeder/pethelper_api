import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateUserService } from '../../application/service/users/create-user.service';
import { User, UsersSchema } from '../../domain/schemas/users.schema';
import { UsersRepository } from '../../adapter/repository/users.repository';
import { ClientAuthService } from '../../adapter/repository/client/client-auth.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../config/configuration';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from '../../adapter/controller/users.controller';
import { GetUserValidationService } from '../service/users/get-user-validation.service';
import { UpdateUserService } from '../../application/service/users/update-user.service';
import { AuthJwtModule } from './auth-jwt.module';
import { GetUserService } from '../service/users/get-user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }])
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   load: [configuration]
    // }),
    // AuthJwtModule,
    // HttpModule
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
