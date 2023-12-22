import { AnySchema, ObjectSchema, Root, SchemaMap } from 'joi';
import * as Joi from 'joi';
import {
  FieldItemSchema,
  FieldSchemaPage
} from 'src/microservice/domain/interface/field-schema.interface';
import { InputSchema } from 'src/microservice/domain/interface/input-schema.interface';
import { SchemaValidator } from './schema-validator.helper';
import { InternalServerErrorException } from '@nestjs/common';
import {
  commonActivationSchema,
  commonGroupBySchema,
  commonSearchSchema,
  manyCloneSchema,
  singleCloneSchema
} from 'src/microservice/domain/field-schemas/abstract-input.schema';
import { SearchEgineOperators } from 'src/microservice/domain/interface/search-engine.interface';
import { InvalidDataException } from '@devseeder/microservices-exceptions';
import { SKIP_ENUMS, SKIP_ENUMS_ALIAS } from '../../app.constants';
import { ErrorService } from '../../service/configuration/error-schema/error.service';
import { ErrorKeys } from 'src/microservice/domain/enum/error-keys.enum';
import { GetTranslationService } from '../../service/translation/get-translation.service';

export class FieldSchemaBuilder {
  private schemaValidator: SchemaValidator;
  constructor(
    protected readonly errorService: ErrorService,
    private readonly translationService: GetTranslationService
  ) {
    this.schemaValidator = new SchemaValidator(
      errorService,
      translationService
    );
  }

  buildSchemas(fieldSchema: FieldItemSchema[]): InputSchema {
    return {
      search: this.buildSearchSchema(fieldSchema, commonSearchSchema),
      update: this.buildUpdateSchema(fieldSchema),
      create: this.buildCreateSchema(fieldSchema),
      cloneOne: this.buildCloneSchema(fieldSchema, singleCloneSchema),
      cloneMany: this.buildCloneSchema(fieldSchema, manyCloneSchema),
      count: this.buildSearchSchema(fieldSchema),
      groupBy: this.buildSearchSchema(fieldSchema, commonGroupBySchema),
      activation: Joi.object({ ...commonActivationSchema })
    };
  }

  buildSearchSchema(
    fieldSchema: FieldItemSchema[],
    commons: SchemaMap = {}
  ): ObjectSchema {
    const objectSchema: SchemaMap = {};

    fieldSchema
      .filter((field) => field.allowed.search)
      .forEach((schema) => {
        if (this.buildSearchEngine(schema, objectSchema)) return;

        const joiSchema = this.getType(Joi, schema, true);

        if (schema.type === 'enum')
          objectSchema[schema.key] = joiSchema
            .optional()
            .custom(this.schemaValidator.validateEnum(schema.enumValues));
        else objectSchema[schema.key] = joiSchema.optional();
      });
    return Joi.object({ ...commons, ...objectSchema });
  }

  buildUpdateSchema(fieldSchema: FieldItemSchema[]): ObjectSchema {
    return Joi.object(this.buildObjectUpdate(fieldSchema));
  }

  buildCloneSchema(
    fieldSchema: FieldItemSchema[],
    cloneSchema: SchemaMap
  ): ObjectSchema {
    return Joi.object({
      ...cloneSchema,
      replaceBody: this.buildObjectUpdate(fieldSchema)
    });
  }

  buildObjectUpdate(fieldSchema: FieldItemSchema[]): SchemaMap {
    const objectSchema: SchemaMap = {};

    fieldSchema
      .filter((field) => field.allowed.update)
      .forEach((schema) => {
        const joiSchema = this.getType(Joi, schema, false, schema?.array);
        if (schema.type === 'enum')
          objectSchema[schema.key] = joiSchema
            .optional()
            .custom(this.schemaValidator.validateEnum(schema.enumValues));
        else objectSchema[schema.key] = joiSchema.optional();
      });
    return objectSchema;
  }

  buildCreateSchema(fieldSchema: FieldItemSchema[]): ObjectSchema {
    const objectSchema: SchemaMap = {};

    fieldSchema.forEach((schema) => {
      let joiSchema = this.getType(Joi, schema, false, schema?.array);
      joiSchema = schema.required ? joiSchema.required() : joiSchema.optional();

      if (schema.type === 'enum')
        objectSchema[schema.key] = joiSchema
          .optional()
          .custom(this.schemaValidator.validateEnum(schema.enumValues));
      else objectSchema[schema.key] = joiSchema.optional();
    });
    return Joi.object(objectSchema);
  }

  getType(
    Joi: Root,
    schema: FieldItemSchema,
    search = false,
    array = false
  ): AnySchema {
    switch (schema.type) {
      case 'text':
      case 'string':
        return Joi.string();
      case 'email':
        return Joi.string().email();
      case 'externalId':
        return array ? Joi.array() : Joi.string();
      case 'enum':
        return schema.itensType === 'string' ? Joi.string() : Joi.number();
      case 'boolean':
        return Joi.boolean();
      case 'number':
      case 'double':
      case 'integer':
        let joiSchema = Joi.number();
        if (schema.min !== undefined) joiSchema = joiSchema.min(schema.min);
        if (schema.max !== undefined) joiSchema = joiSchema.max(schema.max);
        return joiSchema;
      case 'date':
        return Joi.alternatives().try(
          Joi.date().iso(),
          Joi.string().regex(/^@/)
        );
      case 'array':
        return search ? Joi.string() : Joi.array();
      case 'translation':
      case 'object':
      case 'json':
        return Joi.object();
      default:
        this.errorService.throwError(ErrorKeys.NOT_IMPLEMENTED, {
          key: 'Schema type',
          value: schema.type
        });
    }
  }

  buildSearchEngine(schema: FieldItemSchema, objectSchema: SchemaMap): boolean {
    if (!schema?.searchEgines) return false;

    let ignoreOriginalKey = false;

    if (schema?.searchEgines.includes(SearchEgineOperators.BETWEEN)) {
      const start = this.getType(Joi, schema, true);
      const end = this.getType(Joi, schema, true);
      objectSchema[`${schema.key}_start`] = start.optional();
      objectSchema[`${schema.key}_end`] = end.optional();
      ignoreOriginalKey = true;
    }

    Object.values(SearchEgineOperators).forEach((op) => {
      if (SKIP_ENUMS.includes(op)) return;
      ignoreOriginalKey = false;
      const joiSchema = this.getType(Joi, schema, true);
      objectSchema[`${schema.key}_${op}`] = joiSchema.optional();
    });

    return ignoreOriginalKey;
  }

  getFormFilterCondition(page: string, field: FieldItemSchema): boolean {
    switch (page) {
      case FieldSchemaPage.SEARCH:
        return field.allowed.search;
      case FieldSchemaPage.UPDATE:
        return field.allowed.update;
      case FieldSchemaPage.CREATE:
        return true;
      default:
        this.errorService.throwError(ErrorKeys.INVALID_DATA, {
          key: 'page',
          value: page
        });
    }
  }

  static checkUndefinedValue(
    value: any,
    schema: FieldItemSchema,
    itemResponse: any,
    operator: SearchEgineOperators
  ): boolean {
    if (value === undefined && SKIP_ENUMS_ALIAS.includes(operator)) return true;

    if (
      itemResponse[`${schema.key}_${operator}`] === undefined &&
      !SKIP_ENUMS.includes(operator)
    )
      return true;

    return false;
  }
}
