import { GroupByResult } from '@devseeder/nestjs-microservices-commons';
import { RelationField } from '@devseeder/nestjs-microservices-commons/dist/interface/relation-field.interface';

export interface GroupExpensesByPetAndCategoryResponse {
  pet: RelationField;
  categories: GroupedCostByCategory[];
  groupResult: GroupByResult;
}

export interface GroupedCostByCategory {
  category: RelationField;
  groupResult: GroupByResult;
}
