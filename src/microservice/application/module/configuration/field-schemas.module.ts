import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FieldSchemasRepository } from 'src/microservice/adapter/repository/field-schemas.repository';
import {
  FieldSchema,
  FieldSchemasSchema
} from 'src/microservice/domain/schemas/field-schemas.schema';
import { GetFieldSchemaService } from 'src/microservice/application/service/configuration/field-schemas/get-field-schemas.service';
import { FieldSchemaDataService } from '../../service/configuration/field-schemas/field-schema-data.service';
import { DependecyTokens } from '../../app.constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FieldSchema.name, schema: FieldSchemasSchema }
    ])
  ],
  controllers: [],
  providers: [
    FieldSchemasRepository,
    GetFieldSchemaService,
    FieldSchemaDataService,
    {
      provide: DependecyTokens.FIELD_SCHEMA_DB,
      useFactory: async (dataService: FieldSchemaDataService) => {
        return await dataService.loadData(); // Método que busca os dados no banco
      },
      inject: [FieldSchemaDataService]
    }
  ],
  exports: [
    FieldSchemasRepository,
    GetFieldSchemaService,
    FieldSchemaDataService,
    DependecyTokens.FIELD_SCHEMA_DB
  ]
})
export class FieldSchemasModule {}
