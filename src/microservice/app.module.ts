import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../config/configuration';
import { ExpensesModule } from './application/module/entity/expenses.module';
import { FieldSchemasModule } from './application/module/configuration/field-schemas.module';
import { GenericModule } from './application/module/generic.module';
import { ExpenseCategory } from './domain/schemas/entity/expense-categories.schema';
import { DependencyEntityTokens } from './application/app.constants';
import { Animal } from './domain/schemas/entity/animals.schema';
import { User } from './domain/schemas/entity/users.schema';
import { Pet } from './domain/schemas/entity/pets.schema';

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
    GenericModule.forFeature<Pet>(Pet.name, DependencyEntityTokens.PET),
    ExpensesModule,
    GenericModule.forFeature<ExpenseCategory>(
      ExpenseCategory.name,
      DependencyEntityTokens.EXPENSE_CATEGORY
    ),
    GenericModule.forFeature<Animal>(
      Animal.name,
      DependencyEntityTokens.ANIMAL
    ),
    GenericModule.forFeature<User>(User.name, DependencyEntityTokens.USER),
    FieldSchemasModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}
