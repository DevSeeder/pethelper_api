import { RelationField } from 'src/microservice/domain/interface/relation-field.interface';
import { GroupByResult } from './group-by.response';

export interface GroupExpensesByPetAndCategoryResponse {
  pet: RelationField;
  categories: GroupedCostByCategory[];
  groupResult: GroupByResult;
}

export interface GroupedCostByCategory {
  category: RelationField;
  groupResult: GroupByResult;
}
