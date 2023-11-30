export interface AggExpensesByPetAndCategoryDto {
  _id: string[];
  categories: Array<{
    category: string;
    totalCost: number;
  }>;
  pet: string[];
  petsId: string[];
}
