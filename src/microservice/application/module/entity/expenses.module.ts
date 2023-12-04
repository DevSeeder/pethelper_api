import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesController } from 'src/microservice/adapter/controller/expenses.controller';
import { ExpensesRepository } from 'src/microservice/adapter/repository/entity/expenses.repository';
import {
  Expense,
  ExpensesSchema
} from 'src/microservice/domain/schemas/entity/expenses.schema';
import { GetExpenseService } from '../../service/entity/expenses/get-expense.service';
import { UsersModule } from './users.module';
import { PetsModule } from './pets.module';
import { ExpenseCategoriesModule } from './expense-categories.module';
import { UpdateExpenseService } from '../../service/entity/expenses/update-expense.service';
import { CreateExpenseService } from '../../service/entity/expenses/create-expense.service';
import { FieldSchemasModule } from '../configuration/field-schemas.module';

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
    GetExpenseService,
    UpdateExpenseService,
    CreateExpenseService
  ],
  exports: [
    ExpensesRepository,
    GetExpenseService,
    UpdateExpenseService,
    CreateExpenseService
  ]
})
export class ExpensesModule {}
