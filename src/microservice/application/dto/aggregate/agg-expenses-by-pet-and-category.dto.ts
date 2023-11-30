export interface AggExpensesByPetAndCategoryDto {
  _id: string[];
  categories: Array<{
    category: string;
    totalCost: number;
    avgCost: number;
    count: number;
  }>;
  pet: string[];
  petsId: string[];
}
