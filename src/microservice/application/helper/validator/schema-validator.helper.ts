import {
  BadRequestException,
  Logger,
  NotAcceptableException
} from '@nestjs/common';
import { ObjectSchema, number } from 'joi';
import { StringHelper } from '../types/string.helper';
import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';
import { DynamicValueService } from '../../service/dynamic/get-dynamic-value.service';
import { ComparatorHelper } from './comparator.helper';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { SearchEncapsulatorHelper } from '../search/search-encapsulator.helper';

export class SchemaValidator {
  static logger = new Logger(SchemaValidator.name);

  static validateSchema(
    schema: ObjectSchema,
    obj: object,
    fieldSchemasDb: FieldSchema[] = [],
    encapsulate = false
  ) {
    if (!encapsulate)
      return SchemaValidator.validateSingleSchema(schema, obj, fieldSchemasDb);
    const arrToValidate = SearchEncapsulatorHelper.cleanToValidateSchema(obj);
    SchemaValidator.logger.log(
      `Array To Validate: ${JSON.stringify(arrToValidate)}`
    );
    arrToValidate.forEach((objItem) => {
      SchemaValidator.validateSingleSchema(schema, objItem, fieldSchemasDb);
    });
  }

  static validateSingleSchema(
    schema: ObjectSchema,
    obj: object,
    fieldSchemasDb: FieldSchema[] = []
  ) {
    const { error } = schema.validate(obj);
    if (error)
      throw new BadRequestException(
        StringHelper.capitalizeFirstLetter(error.message.replaceAll('"', ''))
      );

    fieldSchemasDb
      .filter(
        (field) =>
          obj[field.key] !== undefined &&
          field.validations &&
          field.validations.length
      )
      .forEach((fieldSchema) => {
        SchemaValidator.executeValidationField(fieldSchema, obj);
      });
  }

  static validateEnum(values: any[]): any {
    return (value, helpers) => {
      if (!values.includes(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    };
  }

  static executeValidationField(schema: FieldItemSchema, item: object) {
    schema.validations.forEach((val) => {
      const value = DynamicValueService.getDynamicValue(
        val.value,
        val.value,
        item
      );
      const isValid = ComparatorHelper.compare(
        item[schema.key],
        value,
        val.operator,
        schema.type
      );

      if (!isValid)
        throw new NotAcceptableException(
          ComparatorHelper.getCompareErrorMessage(
            schema.key,
            val.value,
            val.operator
          )
        );
    });
  }

  static removeUndefined<FilteredObject>(obj: object): FilteredObject {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== undefined)
    ) as FilteredObject;
  }
}
