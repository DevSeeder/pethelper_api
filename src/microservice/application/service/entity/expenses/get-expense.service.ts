import { Injectable } from '@nestjs/common';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import { ExpensesRepository } from 'src/microservice/adapter/repository/expenses.repository';
import {
  Expense,
  ExpenseDocument
} from '../../../../domain/schemas/expenses.schema';
import { ExpenseResponse } from 'src/microservice/application/dto/response/expense.response';
import { SearchExpenseDto } from 'src/microservice/application/dto/search/search-expense.dto';
import { GetUserService } from '../users/get-user.service';
import { GetPetService } from '../pets/get-pet.service';
import { GetExpenseCategoriesService } from '../expense-categories/get-expense-category.service';
import { GetFieldSchemaService } from '../../configuration/field-schemas/get-field-schemas.service';
import {
  GroupExpensesByPetAndCategoryResponse,
  GroupedCostByCategory
} from 'src/microservice/application/dto/response/groupby/group-expenses-by-pet-and-category.response';

@Injectable()
export class GetExpenseService extends AbstractGetService<
  Expense,
  ExpenseDocument,
  ExpenseResponse,
  SearchExpenseDto
> {
  constructor(
    protected readonly repository: ExpensesRepository,
    protected readonly getPetsService: GetPetService,
    protected readonly getUsersService: GetUserService,
    protected readonly getExpenseCategoriesService: GetExpenseCategoriesService,
    protected readonly getFieldSchemaService: GetFieldSchemaService
  ) {
    super(repository, 'Expense', ['expenses'], getFieldSchemaService);
  }

  async groupByPetsAndCategory(): Promise<
    GroupExpensesByPetAndCategoryResponse[]
  > {
    const aggResponse = await this.repository.groupByPetsAndCategory();

    const arrResponse: GroupExpensesByPetAndCategoryResponse[] = [];

    for await (const agg of aggResponse) {
      let totalPet = 0;
      const arrCategories: GroupedCostByCategory[] = [];
      const pet = await this.getPetsService.getById(agg.petsId[0]);
      for await (const aggCategory of agg.categories) {
        const category = await this.getExpenseCategoriesService.getById(
          aggCategory.category
        );
        arrCategories.push({
          category: {
            id: category._id,
            value: category.name
          },
          totalCost: aggCategory.totalCost
        });
        totalPet += aggCategory.totalCost;
      }
      arrResponse.push({
        pet: {
          id: pet._id,
          value: pet.name
        },
        categories: arrCategories,
        totalCost: totalPet
      });
    }

    return arrResponse;
  }
}
