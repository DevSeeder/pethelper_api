import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateUserService } from '../../service/entity/users/create-user.service';
import { User, UsersSchema } from '../../../domain/schemas/entity/users.schema';
import { UsersRepository } from '../../../adapter/repository/entity/users.repository';
import { ClientAuthService } from '../../../adapter/repository/client/client-auth.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../../config/configuration';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from '../../../adapter/controller/users.controller';
import { GetUserValidationService } from '../../service/entity/users/get-user-validation.service';
import { AuthJwtModule } from '../auth/auth-jwt.module';
import { FieldSchemasModule } from '../configuration/field-schemas.module';
import { EntitySchemasModule } from '../configuration/entity-schemas.module';
import { TranslationsModule } from '../translation/translation.module';
import { ErrorSchemasModule } from '../configuration/error-schemas.module';
import { DependencyEntityTokens } from '../../app.constants';
import { GenericModule } from '../generic.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   load: [configuration]
    // }),
    // AuthJwtModule,
    // HttpModule,
    GenericModule.forFeature<User>(
      User.name,
      UsersSchema,
      DependencyEntityTokens.USER
    ),
    FieldSchemasModule,
    EntitySchemasModule,
    TranslationsModule,
    ErrorSchemasModule
  ],
  controllers: [UsersController],
  providers: [
    // CreateUserService,
    // ClientAuthService,
    // GetUserValidationService,
    // UpdateUserService
  ],
  exports: []
})
export class UsersModule {}
