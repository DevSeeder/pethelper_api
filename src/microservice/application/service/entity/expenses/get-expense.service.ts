import { Inject, Injectable, Scope, forwardRef } from '@nestjs/common';
import { GenericGetService } from '../../abstract/generic-get.service';
import { Expense } from '../../../../domain/schemas/entity/expenses.schema';
import { ExpenseResponse } from 'src/microservice/application/dto/response/expense.response';
import { SearchExpenseDto } from 'src/microservice/application/dto/search/search-expense.dto';
import {
  GroupExpensesByPetAndCategoryResponse,
  GroupedCostByCategory
} from 'src/microservice/application/dto/response/groupby/group-expenses-by-pet-and-category.response';
import {
  DependecyTokens,
  DependencyEntityTokens
} from 'src/microservice/application/app.constants';
import { GetTranslationService } from '../../translation/get-translation.service';
import { ErrorService } from '../../configuration/error-schema/error.service';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from 'src/microservice/domain/schemas/entity/expense-categories.schema';
import { Search } from '@devseeder/nestjs-microservices-commons';
import { SearchDomainDto } from 'src/microservice/application/dto/search/search-domain.dto';
import { User } from 'src/microservice/domain/schemas/entity/users.schema';
import { ExpensesRepository } from 'src/microservice/adapter/repository/entity/expenses.repository';
import { Pet } from 'src/microservice/domain/schemas/entity/pets.schema';
import { PetResponse } from 'src/microservice/application/dto/response/pet.response';
import { SearchPetDto } from 'src/microservice/application/dto/search/search-pet.dto';
import { REQUEST } from '@nestjs/core';
import {
  EntitySchema,
  FieldSchema
} from '@devseeder/nestjs-microservices-schemas';

@Injectable({ scope: Scope.REQUEST })
export class GetExpenseService extends GenericGetService<
  Expense,
  ExpenseResponse,
  SearchExpenseDto
> {
  constructor(
    @Inject(`GENERIC_REPOSITORY_${DependencyEntityTokens.EXPENSE}`)
    protected readonly repository: ExpensesRepository,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData: EntitySchema[],
    protected readonly translationService?: GetTranslationService,
    protected readonly errorService?: ErrorService,
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.PET}`)
    protected readonly getPetsService?: GenericGetService<
      Pet,
      PetResponse,
      SearchPetDto
    >,
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.USER}`)
    protected readonly getUsersService?: GenericGetService<User, User, Search>,
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.EXPENSE_CATEGORY}`)
    protected readonly getExpenseCategoriesService?: GenericGetService<
      ExpenseCategory,
      ExpenseCategoryDocument,
      SearchDomainDto
    >,
    @Inject(REQUEST) protected readonly request?: Request
  ) {
    super(
      repository,
      DependencyEntityTokens.EXPENSE,
      fieldSchemaData,
      entitySchemaData,
      translationService,
      errorService,
      request
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
