import { RelationField } from 'src/microservice/domain/interface/relation-field.interface';

export interface GroupExpensesByPetAndCategoryResponse {
  pet: RelationField;
  categories: GroupedCostByCategory[];
  totalCost: number;
}

export interface GroupedCostByCategory {
  category: RelationField;
  totalCost: number;
}
