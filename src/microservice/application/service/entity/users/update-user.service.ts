import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../../adapter/repository/entity/users.repository';
import { UserDTO } from '../../../../domain/model/dto/users/user.dto';
import { GenericUpdateService } from '../../abstract/generic-update.service';
import {
  User,
  UserDocument
} from 'src/microservice/domain/schemas/entity/users.schema';
import { Search } from '@devseeder/nestjs-microservices-commons';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../../translation/get-translation.service';
import { ErrorService } from '../../configuration/error-schema/error.service';

@Injectable()
export class UpdateUserService extends GenericUpdateService<
  User,
  User,
  UserDTO,
  Search
> {
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
