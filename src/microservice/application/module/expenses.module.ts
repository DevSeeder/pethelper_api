import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesController } from 'src/microservice/adapter/controller/expenses.controller';
import { ExpensesRepository } from 'src/microservice/adapter/repository/expenses.repository';
import {
  Expense,
  ExpensesSchema
} from 'src/microservice/domain/schemas/expenses.schema';
import { GetExpenseService } from '../service/expenses/get-expense.service';
import { UsersModule } from './users.module';
import { PetsModule } from './pets.module';
import { ExpenseCategoriesModule } from './expense-categories.module';
import { UpdateExpenseService } from '../service/expenses/update-expense.service';
import { CreateExpenseService } from '../service/expenses/create-expense.service';
import { FieldSchemasModule } from './field-schemas.module';
import { importAsyncService } from '../helper/init-service-module.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpensesSchema }]),
    forwardRef(() => PetsModule),
    UsersModule,
    ExpenseCategoriesModule,
    FieldSchemasModule
  ],
  controllers: [ExpensesController],
  providers: [
    ExpensesRepository,
    importAsyncService(GetExpenseService),
    importAsyncService(UpdateExpenseService),
    importAsyncService(CreateExpenseService)
  ],
  exports: [
    ExpensesRepository,
    GetExpenseService,
    UpdateExpenseService,
    CreateExpenseService
  ]
})
export class ExpensesModule {}
