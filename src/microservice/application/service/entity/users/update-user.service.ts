import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../../adapter/repository/users.repository';
import { UserDTO } from '../../../../domain/model/dto/users/user.dto';
import { AbstractUpdateService } from '../../abstract/abstract-update.service';
import {
  User,
  UserDocument
} from 'src/microservice/domain/schemas/users.schema';
import { Search } from '@devseeder/nestjs-microservices-commons';
import { GetFieldSchemaService } from '../../configuration/field-schemas/get-field-schemas.service';

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
    protected readonly getFieldSchemaService?: GetFieldSchemaService
  ) {
    super(usersRepository, 'User', ['users'], getFieldSchemaService);
  }
}
