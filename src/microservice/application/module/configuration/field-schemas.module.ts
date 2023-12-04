import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FieldSchemasRepository } from 'src/microservice/adapter/repository/configuration/field-schemas.repository';
import {
  FieldSchema,
  FieldSchemasSchema
} from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { GetFieldSchemaService } from 'src/microservice/application/service/configuration/field-schemas/get-field-schemas.service';
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
    {
      provide: DependecyTokens.FIELD_SCHEMA_DB,
      useFactory: async (dataService: GetFieldSchemaService) => {
        return await dataService.getAll(); // Método que busca os dados no banco
      },
      inject: [GetFieldSchemaService]
    }
  ],
  exports: [
    FieldSchemasRepository,
    GetFieldSchemaService,
    DependecyTokens.FIELD_SCHEMA_DB
  ]
})
export class FieldSchemasModule {}
