import {
  BadRequestException,
  HttpStatus,
  Logger,
  NotAcceptableException
} from '@nestjs/common';
import { ObjectSchema, ValidationError, number } from 'joi';
import { StringHelper } from '../types/string.helper';
import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';
import { DynamicValueService } from '../../service/dynamic/get-dynamic-value.service';
import { ComparatorHelper } from './comparator.helper';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { SearchEncapsulatorHelper } from '../search/search-encapsulator.helper';
import { ErrorService } from '../../service/configuration/error-schema/error.service';
import { GetTranslationService } from '../../service/translation/get-translation.service';
import { CustomErrorException } from '@devseeder/microservices-exceptions';

export class SchemaValidator {
  private logger = new Logger(SchemaValidator.name);
  constructor(
    private readonly errorService: ErrorService,
    private readonly translationService: GetTranslationService
  ) {}

  async validateSchema(
    schema: ObjectSchema,
    obj: object,
    fieldSchemasDb: FieldSchema[] = [],
    encapsulate = false
  ) {
    if (!encapsulate)
      await this.validateSingleSchema(schema, obj, fieldSchemasDb);

    const arrToValidate = SearchEncapsulatorHelper.cleanToValidateSchema(obj);
    this.logger.log(`Array To Validate: ${JSON.stringify(arrToValidate)}`);

    for await (const objItem of arrToValidate)
      await this.validateSingleSchema(schema, objItem, fieldSchemasDb);
  }

  async validateSingleSchema(
    schema: ObjectSchema,
    obj: object,
    fieldSchemasDb: FieldSchema[] = []
  ) {
    const { error } = schema.validate(obj, {
      messages: await this.errorService.getJoiErrors()
    });

    if (error) await this.printSchemaError(error, fieldSchemasDb);

    const validationSchemas = fieldSchemasDb.filter(
      (field) =>
        obj[field.key] !== undefined &&
        field.validations &&
        field.validations.length
    );

    for await (const fieldSchema of validationSchemas)
      await this.executeValidationField(fieldSchema, obj);
  }

  validateEnum(values: any[]): any {
    return (value, helpers) => {
      if (!values.includes(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    };
  }

  async executeValidationField(
    schema: FieldItemSchema,
    item: object
  ): Promise<void> {
    if (!schema.validations || !schema.validations.length) return;

    for await (const val of schema.validations) {
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

      if (!isValid) {
        const compHelper = new ComparatorHelper(
          this.errorService,
          this.translationService,
          [schema.entity]
        );
        await compHelper.getComparatorError(
          schema.key,
          val.value,
          val.operator
        );
      }
    }
  }

  private async printSchemaError(
    error: ValidationError,
    fieldSchemas: FieldSchema[]
  ): Promise<void> {
    this.logger.error(JSON.stringify(error));

    let message = error.message;

    const translate = StringHelper.extractKey(
      error.message,
      /@translate\(([^)]+)\)/
    );

    if (translate) {
      const translateKey = translate.replaceAll('"', '');

      const fieldTranslation =
        await this.translationService.getFieldTranslation(
          [fieldSchemas.filter((sch) => sch.key === translateKey)[0].entity],
          translateKey
        );
      message = message.replaceAll(
        `@translate(${translate})`,
        fieldTranslation.fieldLabel
      );
    }

    throw new CustomErrorException(
      StringHelper.capitalizeFirstLetter(message.replaceAll('"', '')),
      HttpStatus.NOT_ACCEPTABLE,
      422
    );
  }

  static removeUndefined<FilteredObject>(obj: object): FilteredObject {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== undefined)
    ) as FilteredObject;
  }
}
