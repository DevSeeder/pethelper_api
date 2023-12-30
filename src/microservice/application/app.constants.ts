import { SearchEgineOperators } from '@devseeder/nestjs-microservices-schemas';

// CONFIG KEYS
export const PROJECT_KEY = 'PET_HELPER';
export const GLOBAL_ENTITY = 'global';
export const DEFAULT_LANG = 'pt-BR';

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

export enum DependencyEntityTokens {
  COLOR = 'colors',
  ANIMAL_GROUP = 'animalGroups',
  ANIMAL_TYPE = 'animalTypes',
  RACE = 'races',
  EXPENSE_CATEGORY = 'expenseCategories',
  ANIMAL = 'animals',
  PET = 'pets',
  EXPENSE = 'expenses',
  USER = 'users'
}
