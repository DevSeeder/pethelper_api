import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../../adapter/repository/entity/users.repository';
import {
  User,
  UserDocument
} from '../../../../domain/schemas/entity/users.schema';
import { GenericGetService } from '../../abstract/generic-get.service';
import { Search } from '../../../dto/search/search.dto';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../../translation/get-translation.service';
import { ErrorService } from '../../configuration/error-schema/error.service';

@Injectable()
export class GetUserService extends GenericGetService<User, User, Search> {
  constructor(
    protected readonly repository: UsersRepository,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData: EntitySchema[],
    protected readonly translationService?: GetTranslationService,
    protected readonly errorService?: ErrorService
  ) {
    super(
      repository,
      'users',
      fieldSchemaData,
      entitySchemaData,
      translationService,
      errorService
    );
  }
}
