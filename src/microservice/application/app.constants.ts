import { SearchEgineOperators } from '../domain/interface/search-engine.interface';

export const PROJECT_KEY = 'PET_HELPER';
export const GLOBAL_ENTITY = 'global';
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

export enum DependecyTokens {
  FIELD_SCHEMA_DB = 'FIELD_SCHEMA_DB',
  ENTITY_SCHEMA_DB = 'ENTITY_SCHEMA_DB'
}
