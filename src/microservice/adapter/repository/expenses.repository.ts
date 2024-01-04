import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Expense,
  ExpenseDocument
} from 'src/microservice/domain/schemas/expenses.schema';
import { AggExpensesByPetAndCategoryDto } from 'src/microservice/application/dto/aggregate/agg-expenses-by-pet-and-category.dto';
import { SearchExpenseDto } from 'src/microservice/application/dto/search/search-expense.dto';
import { GenericRepository } from '@devseeder/nestjs-microservices-commons';

@Injectable()
export class ExpensesRepository extends GenericRepository<Expense> {
  constructor(
    @InjectModel(Expense.name)
    model: Model<ExpenseDocument>
  ) {
    super(model);
  }

  async groupByPetsAndCategory(
    searchParams: SearchExpenseDto = {}
  ): Promise<AggExpensesByPetAndCategoryDto[]> {
    return this.model.aggregate([
      {
        $match: searchParams
      },
      {
        $unwind: '$pets'
      },
      {
        $lookup: {
          from: 'pets',
          let: { pids: { $split: ['$pets', ','] } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    { $toObjectId: '$_id' },
                    {
                      $map: {
                        input: '$$pids',
                        as: 'pid',
                        in: { $toObjectId: '$$pid' }
                      }
                    }
                  ]
                }
              }
            }
          ],
          as: 'petsObjects'
        }
      },
      {
        $group: {
          _id: {
            petId: '$petsObjects._id',
            category: '$idCategory'
          },
          name: { $first: '$petsObjects.name' },
          petsId: { $first: '$petsObjects._id' },
          totalCost: { $sum: '$cost' },
          avgCost: { $avg: '$cost' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.petId',
          categories: {
            $push: {
              category: '$_id.category',
              totalCost: '$totalCost',
              avgCost: '$avgCost',
              count: '$count'
            }
          },
          pet: { $first: '$name' },
          petsId: { $first: '$petsId' }
        }
      }
    ]);
  }

  async groupByCategoryAndPet(
    searchParams: SearchExpenseDto = {}
  ): Promise<AggExpensesByPetAndCategoryDto[]> {
    return this.model.aggregate([
      {
        $match: searchParams
      },
      {
        $unwind: '$pets'
      },
      {
        $lookup: {
          from: 'pets',
          let: { pids: { $split: ['$pets', ','] } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    { $toObjectId: '$_id' },
                    {
                      $map: {
                        input: '$$pids',
                        as: 'pid',
                        in: { $toObjectId: '$$pid' }
                      }
                    }
                  ]
                }
              }
            }
          ],
          as: 'petsObjects'
        }
      },
      {
        $group: {
          _id: {
            category: '$idCategory',
            petsName: '$petsObjects.name',
            petsId: '$petsObjects._id'
          },
          totalCost: { $sum: '$cost' },
          avgCost: { $avg: '$cost' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.category',
          pets: {
            $push: {
              petsName: { $first: '$_id.petsName' },
              petsId: { $first: '$_id.petsId' },
              totalCost: '$totalCost',
              avgCost: '$avgCost',
              count: '$count'
            }
          }
        }
      }
    ]);
  }
}
