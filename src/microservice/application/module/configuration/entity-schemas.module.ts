import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntitySchemasRepository } from 'src/microservice/adapter/repository/configuration/entity-schemas.repository';

import { DependecyTokens } from '../../app.constants';
import { GetEntitySchemaService } from '../../service/configuration/entity-schema/get-entity-schemas.service';
import {
  EntitySchema,
  EntitySchemasSchema
} from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EntitySchema.name, schema: EntitySchemasSchema }
    ])
  ],
  controllers: [],
  providers: [
    EntitySchemasRepository,
    GetEntitySchemaService,
    {
      provide: DependecyTokens.ENTITY_SCHEMA_DB,
      useFactory: async (dataService: GetEntitySchemaService) => {
        return await dataService.getAll(); // Método que busca os dados no banco
      },
      inject: [GetEntitySchemaService]
    }
  ],
  exports: [
    EntitySchemasRepository,
    GetEntitySchemaService,
    DependecyTokens.ENTITY_SCHEMA_DB
  ]
})
export class EntitySchemasModule {}
