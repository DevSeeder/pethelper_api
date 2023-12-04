import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../../adapter/repository/users.repository';
import { User, UserDocument } from '../../../../domain/schemas/users.schema';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import { Search } from '../../../dto/search/search.dto';
import { GetFieldSchemaService } from '../../configuration/field-schemas/get-field-schemas.service';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/field-schemas.schema';

@Injectable()
export class GetUserService extends AbstractGetService<
  User,
  UserDocument,
  User,
  Search
> {
  constructor(
    protected readonly usersRepository: UsersRepository,
    protected readonly getFieldSchemaService?: GetFieldSchemaService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(
      usersRepository,
      'User',
      ['users'],
      getFieldSchemaService,
      fieldSchemaData
    );
  }
}
