import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { AggregatedDto } from 'src/microservice/application/dto/aggregate/aggregated.dto';

@Injectable()
export abstract class AbstractRepository<
  Collection,
  CollectionDocument
> extends MongooseRepository<Collection, CollectionDocument> {
  constructor(model: Model<CollectionDocument>) {
    super(model);
  }

  getIndexes(): object {
    return this.model.collection.getIndexes() as unknown as object;
  }

  async count(searchParams: object): Promise<number> {
    return this.model.countDocuments(searchParams);
  }

  async groupByArray(
    searchParams: Search,
    entityRel: string,
    fkField: string,
    sumField = ''
  ): Promise<AggregatedDto[]> {
    const aggGroup = { count: { $sum: 1 } };
    if (sumField) {
      aggGroup[`total${sumField.capitalizeFirstLetter()}`] = {
        $sum: `$${sumField}`
      };
      aggGroup[`avg${sumField.capitalizeFirstLetter()}`] = {
        $avg: `$${sumField}`
      };
    }

    return this.model.aggregate([
      {
        $match: searchParams
      },
      {
        $unwind: `$${entityRel}`
      },
      {
        $lookup: {
          from: entityRel,
          let: { pids: { $split: [`$${fkField}`, ','] } },
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
          as: `${entityRel}Objects`
        }
      },
      {
        $group: {
          _id: `$${entityRel}Objects._id`,
          name: { $first: `$${entityRel}Objects.name` },
          ...aggGroup
        }
      }
    ]);
  }
}
