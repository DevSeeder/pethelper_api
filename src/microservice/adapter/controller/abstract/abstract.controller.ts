import { Search } from 'src/microservice/application/dto/search/search.dto';
import { SchemaValidator } from 'src/microservice/application/helper/validator/schema-validator.helper';
import { RequestSchema } from 'src/microservice/domain/interface/input-schema.interface';
import { AbstractBodyDto } from 'src/microservice/application/dto/body/abtract-body.dto';
import { FieldSchemaBuilder } from 'src/microservice/application/helper/validator/field-schema.builder';
import { ErrorKeys } from 'src/microservice/domain/enum/error-keys.enum';
import {
  ErrorService,
  GetTranslationService
} from '@devseeder/nestjs-microservices-schemas';
import {
  EntitySchema,
  FieldSchema
} from '@devseeder/nestjs-microservices-schemas';
import { AbstractEntityLoader } from 'src/microservice/application/loader/abstract-entity.loader';

export abstract class AbstractController<
  Collection,
  GetResponse,
  SearchParams extends Search,
  BodyDto extends AbstractBodyDto
> extends AbstractEntityLoader {
  requestSchema: RequestSchema;
  schemaValidator: SchemaValidator;

  constructor(
    readonly entity: string,
    readonly fieldSchemaData?: FieldSchema[],
    readonly entitySchemaData?: EntitySchema[],
    readonly errorService?: ErrorService,
    readonly translationService?: GetTranslationService
  ) {
    super(entity, fieldSchemaData, entitySchemaData);

    this.requestSchema = new FieldSchemaBuilder(
      errorService,
      translationService,
      entity,
      entitySchemaData
    ).buildRequestSchemas(this.fieldSchemaDb, this.fieldSchemaData);

    this.schemaValidator = new SchemaValidator(
      errorService,
      translationService,
      this.entitySchema,
      this.entitySchemaData
    );
  }

  isMethodAllowed(method: string) {
    if (!this.entitySchema.forbiddenMethods) return;
    const notAllowed = this.entitySchema.forbiddenMethods.filter(
      (m) => m === method
    );
    if (notAllowed.length)
      this.errorService.throwError(ErrorKeys.METHOD_NOT_ALLOWED);
  }
}
