import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseCategoriesRepository } from 'src/microservice/adapter/repository/expense-categories.repository';
import {
  ExpenseCategory,
  ExpenseCategoriesSchema
} from 'src/microservice/domain/schemas/entity/expense-categories.schema';
import { GetExpenseCategoriesService } from 'src/microservice/application/service/entity/expense-categories/get-expense-category.service';
import { UpdateExpenseCategoryService } from '../../service/entity/expense-categories/update-expense-category.service';
import { CreateExpenseCategoryService } from '../../service/entity/expense-categories/create-expense-category.service';
import { ExpenseCategoriesController } from 'src/microservice/adapter/controller/expense-categories.controller';
import { FieldSchemasModule } from '../configuration/field-schemas.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExpenseCategory.name, schema: ExpenseCategoriesSchema }
    ]),
    FieldSchemasModule
  ],
  controllers: [ExpenseCategoriesController],
  providers: [
    ExpenseCategoriesRepository,
    GetExpenseCategoriesService,
    UpdateExpenseCategoryService,
    CreateExpenseCategoryService
  ],
  exports: [
    ExpenseCategoriesRepository,
    GetExpenseCategoriesService,
    UpdateExpenseCategoryService,
    CreateExpenseCategoryService
  ]
})
export class ExpenseCategoriesModule {}
