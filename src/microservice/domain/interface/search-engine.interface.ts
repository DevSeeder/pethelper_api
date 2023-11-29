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
