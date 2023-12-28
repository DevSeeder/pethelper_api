import { Search } from 'src/microservice/application/dto/search/search.dto';
import { SchemaValidator } from 'src/microservice/application/helper/validator/schema-validator.helper';
import { GenericUpdateService } from 'src/microservice/application/service/abstract/generic-update.service';
import { RequestSchema } from 'src/microservice/domain/interface/input-schema.interface';
import { AbstractBodyDto } from 'src/microservice/application/dto/body/abtract-body.dto';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';
import { AbstractController } from './abstract.controller';

export abstract class AbstractUpdateController<
  Collection,
  GetResponse,
  SearchParams extends Search,
  BodyDto extends AbstractBodyDto
> extends AbstractController<Collection, GetResponse, SearchParams, BodyDto> {
  requestSchema: RequestSchema;
  schemaValidator: SchemaValidator;

  constructor(
    readonly entity: string,
    readonly updateService?: GenericUpdateService<
      Collection,
      GetResponse,
      BodyDto,
      SearchParams
    >,
    readonly fieldSchemaData?: FieldSchema[],
    readonly entitySchemaData?: EntitySchema[],
    readonly errorService?: ErrorService,
    readonly translationService?: GetTranslationService
  ) {
    super(
      entity,
      fieldSchemaData,
      entitySchemaData,
      errorService,
      translationService
    );
  }
}
