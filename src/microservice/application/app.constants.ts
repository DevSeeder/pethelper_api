import { SearchEgineOperators } from '../domain/interface/search-engine.interface';

// CONFIG KEYS
export const PROJECT_KEY = 'PET_HELPER';
export const GLOBAL_ENTITY = 'global';

// OPERATORS ENUMS
export const SKIP_ENUMS_ALIAS = [SearchEgineOperators.IN];
export const SKIP_ENUMS = [
  SearchEgineOperators.BETWEEN,
  SearchEgineOperators.IN
];
export const VALIDATE_ID_ENUMS = [
  SearchEgineOperators.IN,
  SearchEgineOperators.NOT_IN,
  SearchEgineOperators.NOT_EQUAL
];

// ADV OPERATORS
export const MAX_ENCAPSULATED_OPERATORS = 10;

// DI
export enum DependecyTokens {
  FIELD_SCHEMA_DB = 'FIELD_SCHEMA_DB',
  ENTITY_SCHEMA_DB = 'ENTITY_SCHEMA_DB'
}
