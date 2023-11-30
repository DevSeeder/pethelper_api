import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FieldSchemasRepository } from 'src/microservice/adapter/repository/field-schemas.repository';
import {
  FieldSchema,
  FieldSchemasSchema
} from 'src/microservice/domain/schemas/field-schemas.schema';
import { GetFieldSchemaService } from 'src/microservice/application/service/configuration/field-schemas/get-field-schemas.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FieldSchema.name, schema: FieldSchemasSchema }
    ])
  ],
  controllers: [],
  providers: [FieldSchemasRepository, GetFieldSchemaService],
  exports: [FieldSchemasRepository, GetFieldSchemaService]
})
export class FieldSchemasModule {}
