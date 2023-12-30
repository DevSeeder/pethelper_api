import { Search } from 'src/microservice/application/dto/search/search.dto';
import { SchemaValidator } from 'src/microservice/application/helper/validator/schema-validator.helper';
import { RequestSchema } from 'src/microservice/domain/interface/input-schema.interface';
import { GenericCreateService } from 'src/microservice/application/service/abstract/generic-create.service';
import { AbstractBodyDto } from 'src/microservice/application/dto/body/abtract-body.dto';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';
import { AbstractController } from './abstract.controller';
import {
  EntitySchema,
  FieldSchema
} from '@devseeder/nestjs-microservices-schemas';

export abstract class AbstractCreateController<
  Collection,
  GetResponse,
  SearchParams extends Search,
  BodyDto extends AbstractBodyDto
> extends AbstractController<Collection, GetResponse, SearchParams, BodyDto> {
  requestSchema: RequestSchema;
  schemaValidator: SchemaValidator;

  constructor(
    readonly entity: string,
    readonly createService?: GenericCreateService<
      Collection,
      GetResponse,
      BodyDto
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
