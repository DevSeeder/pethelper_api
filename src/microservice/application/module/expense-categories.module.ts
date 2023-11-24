import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseCategoriesRepository } from 'src/microservice/adapter/repository/expense-categories.repository';
import {
  ExpenseCategory,
  ExpenseCategoriesSchema
} from 'src/microservice/domain/schemas/expense-categories.schema';
import { GetExpenseCategoriesService } from 'src/microservice/application/service/expense-categories/get-expense-category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExpenseCategory.name, schema: ExpenseCategoriesSchema }
    ])
  ],
  controllers: [],
  providers: [ExpenseCategoriesRepository, GetExpenseCategoriesService],
  exports: [ExpenseCategoriesRepository, GetExpenseCategoriesService]
})
export class ExpenseCategoriesModule {}
