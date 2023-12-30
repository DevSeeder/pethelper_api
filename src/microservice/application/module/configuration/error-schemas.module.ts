import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorSchemasRepository } from 'src/microservice/adapter/repository/config-schemas/error-schemas.repository';
import {
  ErrorSchema,
  ErrorSchemasSchema
} from 'src/microservice/domain/schemas/configuration-schemas/error-schemas.schema';
import { DependecyTokens, PROJECT_KEY } from '../../app.constants';
import { GetErrorSchemaService } from '../../service/configuration/error-schema/get-error-schemas.service';
import { ErrorService } from '../../service/configuration/error-schema/error.service';
import { TranslationsModule } from '@devseeder/nestjs-microservices-schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ErrorSchema.name, schema: ErrorSchemasSchema }
    ]),
    TranslationsModule.forRoot(PROJECT_KEY)
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
    },
    ErrorService
  ],
  exports: [
    ErrorSchemasRepository,
    GetErrorSchemaService,
    ErrorService,
    DependecyTokens.ERROR_SCHEMA_DB
  ]
})
export class ErrorSchemasModule {}
