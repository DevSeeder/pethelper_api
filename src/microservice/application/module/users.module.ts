import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateUserService } from '../../application/service/users/create-user.service';
import { User, UsersSchema } from '../../domain/schemas/users.schema';
import { UsersMongoose } from '../../adapter/repository/users.repository';
import { ClientAuthService } from '../../adapter/repository/client/client-auth.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../config/configuration';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from '../../adapter/controller/users.controller';
import { GetUserService } from '../../application/service/users/get-user.service';
import { UpdateUserService } from '../../application/service/users/update-user.service';
import { AuthJwtModule } from './auth-jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    AuthJwtModule,
    HttpModule
  ],
  controllers: [UsersController],
  providers: [
    UsersMongoose,
    CreateUserService,
    ClientAuthService,
    GetUserService,
    UpdateUserService
  ],
  exports: [UsersMongoose, CreateUserService, ClientAuthService, GetUserService]
})
export class UsersModule {}
