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
  commonSearchSchema,
  manyCloneSchema,
  singleCloneSchema
} from 'src/microservice/domain/field-schemas/abstract-input.schema';
import { SearchEgineOperators } from 'src/microservice/domain/interface/search-engine.interface';
import { InvalidDataException } from '@devseeder/microservices-exceptions';
import { SKIP_ENUMS, SKIP_ENUMS_ALIAS } from '../app.constants';

export class FieldSchemaBuilder {
  static buildSchemas(fieldSchema: FieldItemSchema[]): InputSchema {
    return {
      search: FieldSchemaBuilder.buildSearchSchema(
        fieldSchema,
        commonSearchSchema
      ),
      update: FieldSchemaBuilder.buildUpdateSchema(fieldSchema),
      create: FieldSchemaBuilder.buildCreateSchema(fieldSchema),
      cloneOne: FieldSchemaBuilder.buildCloneSchema(
        fieldSchema,
        singleCloneSchema
      ),
      cloneMany: FieldSchemaBuilder.buildCloneSchema(
        fieldSchema,
        manyCloneSchema
      ),
      count: FieldSchemaBuilder.buildSearchSchema(fieldSchema)
    };
  }

  static buildSearchSchema(
    fieldSchema: FieldItemSchema[],
    commons: SchemaMap = {}
  ): ObjectSchema {
    const objectSchema: SchemaMap = {};

    fieldSchema
      .filter((field) => field.allowed.search)
      .forEach((schema) => {
        if (FieldSchemaBuilder.buildSearchEngine(schema, objectSchema)) return;

        const joiSchema = FieldSchemaBuilder.getType(Joi, schema, true);

        if (schema.type === 'enum')
          objectSchema[schema.key] = joiSchema
            .optional()
            .custom(SchemaValidator.validateEnum(schema.enumValues));
        else objectSchema[schema.key] = joiSchema.optional();
      });
    return Joi.object({ ...commons, ...objectSchema });
  }

  static buildUpdateSchema(fieldSchema: FieldItemSchema[]): ObjectSchema {
    return Joi.object(FieldSchemaBuilder.buildObjectUpdate(fieldSchema));
  }

  static buildCloneSchema(
    fieldSchema: FieldItemSchema[],
    cloneSchema: SchemaMap
  ): ObjectSchema {
    return Joi.object({
      ...cloneSchema,
      replaceBody: FieldSchemaBuilder.buildObjectUpdate(fieldSchema)
    });
  }

  static buildObjectUpdate(fieldSchema: FieldItemSchema[]): SchemaMap {
    const objectSchema: SchemaMap = {};

    fieldSchema
      .filter((field) => field.allowed.update)
      .forEach((schema) => {
        const joiSchema = FieldSchemaBuilder.getType(
          Joi,
          schema,
          false,
          schema?.array
        );
        if (schema.type === 'enum')
          objectSchema[schema.key] = joiSchema
            .optional()
            .custom(SchemaValidator.validateEnum(schema.enumValues));
        else objectSchema[schema.key] = joiSchema.optional();
      });
    return objectSchema;
  }

  static buildCreateSchema(fieldSchema: FieldItemSchema[]): ObjectSchema {
    const objectSchema: SchemaMap = {};

    fieldSchema.forEach((schema) => {
      let joiSchema = FieldSchemaBuilder.getType(
        Joi,
        schema,
        false,
        schema?.array
      );
      joiSchema = schema.required ? joiSchema.required() : joiSchema.optional();

      if (schema.type === 'enum')
        objectSchema[schema.key] = joiSchema
          .optional()
          .custom(SchemaValidator.validateEnum(schema.enumValues));
      else objectSchema[schema.key] = joiSchema.optional();
    });
    return Joi.object(objectSchema);
  }

  static getType(
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
      default:
        throw new InternalServerErrorException(
          `Schema type ${schema.type} not implemented`
        );
    }
  }

  static buildSearchEngine(
    schema: FieldItemSchema,
    objectSchema: SchemaMap
  ): boolean {
    if (!schema?.searchEgines) return false;

    let ignoreOriginalKey = false;

    if (schema?.searchEgines.includes(SearchEgineOperators.BETWEEN)) {
      const start = FieldSchemaBuilder.getType(Joi, schema, true);
      const end = FieldSchemaBuilder.getType(Joi, schema, true);
      objectSchema[`${schema.key}_start`] = start.optional();
      objectSchema[`${schema.key}_end`] = end.optional();
      ignoreOriginalKey = true;
    }

    Object.values(SearchEgineOperators).forEach((op) => {
      if (SKIP_ENUMS.includes(op)) return;
      ignoreOriginalKey = false;
      const joiSchema = FieldSchemaBuilder.getType(Joi, schema, true);
      objectSchema[`${schema.key}_${op}`] = joiSchema.optional();
    });

    return ignoreOriginalKey;
  }

  static getFormFilterCondition(page: string, field: FieldItemSchema): boolean {
    switch (page) {
      case FieldSchemaPage.SEARCH:
        return field.allowed.search;
      case FieldSchemaPage.UPDATE:
        return field.allowed.update;
      case FieldSchemaPage.CREATE:
        return true;
      default:
        throw new InvalidDataException('page', page);
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
