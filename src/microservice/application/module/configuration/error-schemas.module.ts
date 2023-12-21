import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorSchemasRepository } from 'src/microservice/adapter/repository/config-schemas/error-schemas.repository';
import {
  ErrorSchema,
  ErrorSchemasSchema
} from 'src/microservice/domain/schemas/configuration-schemas/error-schemas.schema';
import { DependecyTokens } from '../../app.constants';
import { GetErrorSchemaService } from '../../service/configuration/error-schema/get-error-schemas.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ErrorSchema.name, schema: ErrorSchemasSchema }
    ])
  ],
  controllers: [],
  providers: [
    ErrorSchemasRepository,
    GetErrorSchemaService,
    {
      provide: DependecyTokens.ERROR_SCHEMA_DB,
      useFactory: async (dataService: GetErrorSchemaService) => {
        return await dataService.getAll(); // Método que busca os dados no banco
      },
      inject: [GetErrorSchemaService]
    }
  ],
  exports: [
    ErrorSchemasRepository,
    GetErrorSchemaService,
    DependecyTokens.ERROR_SCHEMA_DB
  ]
})
export class ErrorSchemasModule {}
