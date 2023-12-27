import { Module } from '@nestjs/common';
import {
  Animal,
  AnimalsSchema
} from 'src/microservice/domain/schemas/entity/animals.schema';
import { AnimalsController } from 'src/microservice/adapter/controller/animals.controller';
import { FieldSchemasModule } from '../configuration/field-schemas.module';
import { EntitySchemasModule } from '../configuration/entity-schemas.module';
import { TranslationsModule } from '../translation/translation.module';
import { ErrorSchemasModule } from '../configuration/error-schemas.module';
import { GenericModule } from '../generic.module';
import {
  AnimalGroup,
  AnimalGroupsSchema
} from 'src/microservice/domain/schemas/entity/animal-group.schema';
import { DependencyEntityTokens } from '../../app.constants';

@Module({
  imports: [
    GenericModule.forFeature<AnimalGroup>(
      AnimalGroup.name,
      AnimalGroupsSchema,
      DependencyEntityTokens.ANIMAL_GROUP
    ),
    GenericModule.forFeature<Animal>(
      Animal.name,
      AnimalsSchema,
      DependencyEntityTokens.ANIMAL
    ),
    FieldSchemasModule,
    EntitySchemasModule,
    TranslationsModule,
    ErrorSchemasModule
  ],
  controllers: [AnimalsController],
  providers: [],
  exports: []
})
export class AnimalsModule {}
