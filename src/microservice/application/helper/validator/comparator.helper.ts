import { CompareOperators } from 'src/microservice/domain/interface/search-engine.interface';
import { DynamicValueService } from '../../service/dynamic/get-dynamic-value.service';

export class ComparatorHelper {
  static compare(
    valueA: any,
    valueB: any,
    operator: CompareOperators,
    type: string
  ): boolean {
    switch (type) {
      case 'text':
      case 'varchar':
      case 'string':
        valueA = String(valueA);
        valueB = String(valueB);
      case 'number':
      case 'double':
      case 'integer':
        valueA = Number(valueA);
        valueB = Number(valueB);
        break;
      default:
        return ComparatorHelper.compareValues(valueA, valueB, operator);
    }
  }

  static compareValues(
    valueA: any,
    valueB: any,
    operator: CompareOperators
  ): boolean {
    switch (operator) {
      case CompareOperators.GREATER_THEN:
        return valueA > valueB;
      case CompareOperators.GREATER_THEN_EQUAL:
        return valueA >= valueB;
      case CompareOperators.LOWER_THEN:
        return valueA < valueB;
      case CompareOperators.LOWER_THEN_EQUAL:
        return valueA <= valueB;
      case CompareOperators.NOT_EQUAL:
        return valueA != valueB;
      case CompareOperators.EQUAL:
        return valueA == valueB;
      case CompareOperators.IN:
        return valueB.includes(valueA);
      case CompareOperators.NOT_IN:
        return !valueB.includes(valueA);
      case CompareOperators.LIKE:
        return (valueA as string).indexOf(valueB) > -1;
      case CompareOperators.BETWEEN:
        return valueA >= valueB[0] && valueA <= valueB[1];
      case CompareOperators.BEGINS_WITH:
        return valueA.startsWith(valueB);
      case CompareOperators.ENDS_WITH:
        return (valueA as string).endsWith(valueB);
      case CompareOperators.CONTAINS:
        return valueA.includes(valueB);
      case CompareOperators.NOT_CONTAINS:
        return !valueA.includes(valueB);
    }
  }

  static getCompareErrorMessage(
    key: string,
    value: any,
    operator: CompareOperators
  ): string {
    const valueB = DynamicValueService.getValueMessage(value, value);
    switch (operator) {
      case CompareOperators.GREATER_THEN:
        return `"${key.capitalizeFirstLetter()}" must be greater then ${valueB}`;
      case CompareOperators.GREATER_THEN_EQUAL:
        return `"${key.capitalizeFirstLetter()}" must be greater then or equal to ${valueB}`;
      case CompareOperators.LOWER_THEN:
        return `"${key.capitalizeFirstLetter()}" must be lower then ${valueB}`;
      case CompareOperators.LOWER_THEN_EQUAL:
        return `"${key.capitalizeFirstLetter()}" must be lower then or equal to ${valueB}`;
      case CompareOperators.NOT_EQUAL:
        return `"${key.capitalizeFirstLetter()}" must be different from ${valueB}`;
      case CompareOperators.EQUAL:
        return `"${key.capitalizeFirstLetter()}" must be equal to ${valueB}`;
      case CompareOperators.IN:
        return `"${key.capitalizeFirstLetter()}" must be in this values '${valueB.join(
          ', '
        )}'`;
      case CompareOperators.NOT_IN:
        return `"${key.capitalizeFirstLetter()}" must not be in this values '${valueB.join(
          ', '
        )}'`;
      case CompareOperators.LIKE:
        return `"${key.capitalizeFirstLetter()}" must contain this word '${valueB}'`;
      case CompareOperators.BETWEEN:
        return `"${key.capitalizeFirstLetter()}" must be between ${
          valueB[0]
        } and ${valueB[1]}`;
      case CompareOperators.BEGINS_WITH:
        return `"${key.capitalizeFirstLetter()}" must begins with '${valueB}'`;
      case CompareOperators.ENDS_WITH:
        return `"${key.capitalizeFirstLetter()}" must ends with '${valueB}'`;
      case CompareOperators.CONTAINS:
        return `"${key.capitalizeFirstLetter()}" must contains this value '${valueB}'`;
      case CompareOperators.NOT_CONTAINS:
        return `"${key.capitalizeFirstLetter()}" must not contains this value '${valueB}'`;
      default:
        return `Invalid ${key.capitalizeFirstLetter()}`;
    }
  }
}
