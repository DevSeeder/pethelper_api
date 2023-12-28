import { Search } from 'src/microservice/application/dto/search/search.dto';
import { SchemaValidator } from 'src/microservice/application/helper/validator/schema-validator.helper';
import { RequestSchema } from 'src/microservice/domain/interface/input-schema.interface';
import { AbstractBodyDto } from 'src/microservice/application/dto/body/abtract-body.dto';
import { FieldSchemaBuilder } from 'src/microservice/application/helper/validator/field-schema.builder';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { AbstractEntityLoader } from './abstract-entity.loader';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { ErrorKeys } from 'src/microservice/domain/enum/error-keys.enum';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';

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
