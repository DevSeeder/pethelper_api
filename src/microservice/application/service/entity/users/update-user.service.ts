import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../../adapter/repository/entity/users.repository';
import { UserDTO } from '../../../../domain/model/dto/users/user.dto';
import { AbstractUpdateService } from '../../abstract/abstract-update.service';
import {
  User,
  UserDocument
} from 'src/microservice/domain/schemas/entity/users.schema';
import { Search } from '@devseeder/nestjs-microservices-commons';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';

@Injectable()
export class UpdateUserService extends AbstractUpdateService<
  User,
  UserDocument,
  User,
  UserDTO,
  Search
> {
  constructor(
    protected readonly usersRepository: UsersRepository,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(usersRepository, 'User', ['users'], fieldSchemaData);
  }
}
