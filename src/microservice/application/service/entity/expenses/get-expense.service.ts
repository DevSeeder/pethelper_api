import { Inject, Injectable } from '@nestjs/common';
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
import { FieldSchema } from 'src/microservice/domain/schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';

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
    protected readonly getFieldSchemaService: GetFieldSchemaService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(
      repository,
      'Expense',
      ['expenses'],
      getFieldSchemaService,
      fieldSchemaData
    );
  }

  async groupByPetsAndCategory(
    searchParams: SearchExpenseDto = {}
  ): Promise<GroupExpensesByPetAndCategoryResponse[]> {
    const searchWhere = await this.buildSearchParams(searchParams);
    const aggResponse = await this.repository.groupByPetsAndCategory(
      searchWhere
    );

    const arrResponse: GroupExpensesByPetAndCategoryResponse[] = [];

    for await (const agg of aggResponse) {
      let totalPet = 0;
      let countPet = 0;
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
          groupResult: {
            totalSum: aggCategory.totalCost,
            avg: aggCategory.avgCost,
            count: aggCategory.count
          }
        });
        totalPet += aggCategory.totalCost;
        countPet += aggCategory.count;
      }
      arrResponse.push({
        pet: {
          id: pet._id,
          value: pet.name
        },
        categories: arrCategories,
        groupResult: {
          totalSum: totalPet,
          avg: Number((totalPet / countPet).toFixed(2)),
          count: countPet
        }
      });
    }

    return arrResponse;
  }

  async groupByCategoryAndPet(
    searchParams: SearchExpenseDto = {}
  ): Promise<any[]> {
    const searchWhere = await this.buildSearchParams(searchParams);
    const aggResponse: any[] = await this.repository.groupByCategoryAndPet(
      searchWhere
    );

    const arrResponse = [];

    for await (const agg of aggResponse) {
      let totalCat = 0;
      let countCat = 0;
      const category = await this.getExpenseCategoriesService.getById(agg._id);

      const arrPets = [];
      for (const aggPet of agg.pets) {
        arrPets.push({
          pet: {
            id: aggPet.petsId,
            value: aggPet.petsName
          },
          groupResult: {
            totalSum: aggPet.totalCost,
            avg: aggPet.avgCost,
            count: aggPet.count
          }
        });
        totalCat += aggPet.totalCost;
        countCat += aggPet.count;
      }
      arrResponse.push({
        category: {
          id: category._id,
          value: category.name
        },
        pets: arrPets,
        groupResult: {
          totalSum: totalCat,
          avg: Number((totalCat / countCat).toFixed(2)),
          count: countCat
        }
      });
      return arrResponse;
    }
  }
}
