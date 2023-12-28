import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../config/configuration';
import { PetsModule } from './application/module/entity/pets.module';
import { ExpensesModule } from './application/module/entity/expenses.module';
import { AnimalsModule } from './application/module/entity/animals.module';
import { FieldSchemasModule } from './application/module/configuration/field-schemas.module';
import { GenericModule } from './application/module/generic.module';
import { ExpenseCategory } from './domain/schemas/entity/expense-categories.schema';
import { DependencyEntityTokens } from './application/app.constants';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('database.mongodb.connection')
      })
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    // AuthJwtModule,
    // HttpModule,
    PetsModule,
    ExpensesModule,
    GenericModule.forFeature<ExpenseCategory>(
      ExpenseCategory.name,
      DependencyEntityTokens.EXPENSE_CATEGORY
    ),
    AnimalsModule,
    FieldSchemasModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}
