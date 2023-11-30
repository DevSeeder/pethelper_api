import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Expense,
  ExpenseDocument
} from 'src/microservice/domain/schemas/expenses.schema';
import { AbstractRepository } from './abstract.repository';
import { AggExpensesByPetAndCategoryDto } from 'src/microservice/application/dto/aggregate/agg-expenses-by-pet-and-category.dto';
import { SearchExpenseDto } from 'src/microservice/application/dto/search/search-expense.dto';

@Injectable()
export class ExpensesRepository extends AbstractRepository<
  Expense,
  ExpenseDocument
> {
  constructor(
    @InjectModel(Expense.name)
    model: Model<ExpenseDocument>
  ) {
    super(model);
  }
  // $lookupOld: {
  //   from: 'pets',
  //   localField: 'pets',
  //   foreignField: '_id',
  //   as: 'pet'
  // },

  async groupByPets(): Promise<any[]> {
    return this.model.aggregate([
      {
        $unwind: '$pets'
      },
      {
        $lookup: {
          from: 'pets',
          let: { pids: { $split: ['$pets', ','] } }, // Split para criar um array de IDs
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
          _id: '$petsObjects._id',
          name: { $first: '$petsObjects.name' },
          totalCost: { $sum: '$cost' }
        }
      }
    ]);
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
          totalCost: { $sum: '$cost' }
        }
      },
      {
        $group: {
          _id: '$_id.petId',
          categories: {
            $push: {
              category: '$_id.category',
              totalCost: '$totalCost'
            }
          },
          pet: { $first: '$name' },
          petsId: { $first: '$petsId' }
        }
      }
    ]);
  }
}
