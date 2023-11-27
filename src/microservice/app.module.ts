import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../config/configuration';
import { PetsModule } from './application/module/pets.module';
import { ExpensesModule } from './application/module/expenses.module';
import { ExpenseCategoriesModule } from './application/module/expense-categories.module';
import { AnimalsModule } from './application/module/animals.module';
import { FieldSchemasModule } from './application/module/field-schemas.module';

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
    ExpenseCategoriesModule,
    AnimalsModule,
    FieldSchemasModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
