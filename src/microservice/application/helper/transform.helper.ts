import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';

export class TransformHelper {
  transformSchema<TransformItem>(
    input: TransformItem,
    fieldSchema: FieldItemSchema[]
  ): TransformItem {
    const schemas = fieldSchema.filter(
      (schema) => schema?.alias && schema?.alias?.search
    );
    const searchDB = { ...input };
    schemas.forEach((item) => {
      const searchKey = item.alias.search;
      searchDB[item.key] = searchDB[searchKey];
      delete searchDB[searchKey];
    });
    return searchDB;
  }
}
