import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';

export class ResponseOrderHelper {
  static orderBy<Response>(
    items: Array<Response>,
    fieldSchema: FieldItemSchema[],
    sort: object,
    hasExternal: boolean
  ): Array<Response> {
    if (!hasExternal || !sort || !Object.keys(sort).length) return items;

    const sortKeys = Object.keys(sort);
    const sortItems = items.sort((a, b) => {
      let orderResult = 0;
      sortKeys.forEach((key) => {
        if (a[key] === b[key]) return;

        const isFK = fieldSchema.filter(
          (schema) =>
            key === schema.key && schema.orderBy && schema.type === 'externalId'
        );

        orderResult = isFK.length
          ? ResponseOrderHelper.compare(a[key].value, b[key].value, sort[key])
          : ResponseOrderHelper.compare(a[key], b[key], sort[key]);
      });
      return orderResult;
    });
    return sortItems;
  }

  static compare(a: any, b: any, mode: number): number {
    console.log(`orderResult = ${a} - ${b}`);
    console.log(typeof a);

    if (typeof a == 'string')
      return mode === 1 ? a.localeCompare(b) : b.localeCompare(a);
    return mode === 1 ? a - b : b - a;
  }
}
