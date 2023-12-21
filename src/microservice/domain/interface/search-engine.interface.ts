export interface SearchEngine {
  key: string;
  operator: SearchEgineOperators;
}

export enum SearchEgineOperators {
  LIKE = 'like',
  IN = 'in',
  NOT_IN = 'nin',
  BETWEEN = 'between',
  GREATER_THEN = 'gt',
  LOWER_THEN = 'lt',
  GREATER_THEN_EQUAL = 'gte',
  LOWER_THEN_EQUAL = 'lte',
  NOT_EQUAL = 'ne'
}

export enum CompareOperators {
  LIKE = 'like',
  IN = 'in',
  NOT_IN = 'nin',
  BETWEEN = 'between',
  GREATER_THAN = 'gt',
  LOWER_THAN = 'lt',
  GREATER_THAN_EQUAL = 'gte',
  LOWER_THAN_EQUAL = 'lte',
  NOT_EQUAL = 'ne',
  EQUAL = 'eq',
  BEGINS_WITH = 'begins_with',
  ENDS_WITH = 'ends_with',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains'
}
