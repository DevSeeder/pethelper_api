import { AnySchema, ObjectSchema, Root, SchemaMap } from 'joi';
import * as Joi from 'joi';
import {
  FieldItemSchema,
  FieldSchemaPage
} from 'src/microservice/domain/interface/field-schema.interface';
import { InputSchema } from 'src/microservice/domain/interface/input-schema.interface';
import { SchemaValidator } from './schema-validator.helper';
import { InternalServerErrorException } from '@nestjs/common';
import { commonSearchSchema } from 'src/microservice/adapter/field-schemas/abstract-input.schema';
import { SearchEgineOperators } from 'src/microservice/domain/interface/search-engine.interface';
import { InvalidDataException } from '@devseeder/microservices-exceptions';

export class FieldSchemaBuilder {
  static buildSchemas(fieldSchema: FieldItemSchema[]): InputSchema {
    return {
      search: FieldSchemaBuilder.buildSearchSchema(fieldSchema),
      update: FieldSchemaBuilder.buildUpdateSchema(fieldSchema),
      create: FieldSchemaBuilder.buildCreateSchema(fieldSchema)
    };
  }

  static buildSearchSchema(fieldSchema: FieldItemSchema[]): ObjectSchema {
    const objectSchema: SchemaMap = {};

    fieldSchema
      .filter((field) => field.allowed.search)
      .forEach((schema) => {
        if (FieldSchemaBuilder.buildSearchEngine(schema, objectSchema)) return;

        const joiSchema = FieldSchemaBuilder.getType(
          Joi,
          schema.type,
          schema?.itensType,
          true
        );
        if (schema.type === 'enum')
          objectSchema[schema.key] = joiSchema
            .optional()
            .custom(SchemaValidator.validateEnum(schema.enumValues));
        else objectSchema[schema.key] = joiSchema.optional();
      });
    return Joi.object({ ...commonSearchSchema, ...objectSchema });
  }

  static buildUpdateSchema(fieldSchema: FieldItemSchema[]): ObjectSchema {
    const objectSchema: SchemaMap = {};

    fieldSchema
      .filter((field) => field.allowed.update)
      .forEach((schema) => {
        // console.log(schema.key);

        const joiSchema = FieldSchemaBuilder.getType(
          Joi,
          schema.type,
          schema?.itensType,
          false,
          schema?.array
        );
        if (schema.type === 'enum')
          objectSchema[schema.key] = joiSchema
            .optional()
            .custom(SchemaValidator.validateEnum(schema.enumValues));
        else objectSchema[schema.key] = joiSchema.optional();
      });
    return Joi.object(objectSchema);
  }

  static buildCreateSchema(fieldSchema: FieldItemSchema[]): ObjectSchema {
    const objectSchema: SchemaMap = {};

    fieldSchema.forEach((schema) => {
      let joiSchema = FieldSchemaBuilder.getType(
        Joi,
        schema.type,
        schema?.itensType,
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
    type: string,
    itensType = undefined,
    search = false,
    array = false
  ): AnySchema {
    switch (type) {
      case 'text':
      case 'string':
        return Joi.string();
      case 'externalId':
        return array ? Joi.array() : Joi.string();
      case 'enum':
        return itensType === 'string' ? Joi.string() : Joi.number();
      case 'boolean':
        return Joi.boolean();
      case 'number':
      case 'double':
      case 'integer':
        return Joi.number();
      case 'date':
        return Joi.date();
      case 'array':
        return search ? Joi.string() : Joi.array();
      default:
        throw new InternalServerErrorException(
          `Schema type ${type} not implemented`
        );
    }
  }

  static buildSearchEngine(
    schema: FieldItemSchema,
    objectSchema: SchemaMap
  ): boolean {
    if (
      schema?.searchEgines &&
      schema?.searchEgines.includes(SearchEgineOperators.BETWEEN)
    ) {
      const start = FieldSchemaBuilder.getType(
        Joi,
        schema.type,
        schema?.itensType,
        true
      );
      const end = FieldSchemaBuilder.getType(
        Joi,
        schema.type,
        schema?.itensType,
        true
      );
      objectSchema[`${schema.key}_start`] = start.optional();
      objectSchema[`${schema.key}_end`] = end.optional();
      return true;
    }
    return false;
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
}
