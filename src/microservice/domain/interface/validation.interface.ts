import { CompareOperators } from './search-engine.interface';

export interface Validation {
  operator: CompareOperators;
  value: any;
  options?: object;
}
