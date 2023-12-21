import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColorsRepository } from 'src/microservice/adapter/repository/entity/colors.repository';
import {
  Color,
  ColorsSchema
} from 'src/microservice/domain/schemas/entity/colors.schema';
import { GetColorService } from 'src/microservice/application/service/entity/colors/get-color.service';
import { FieldSchemasModule } from '../configuration/field-schemas.module';
import { EntitySchemasModule } from '../configuration/entity-schemas.module';
import { TranslationsModule } from '../translation/translation.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Color.name, schema: ColorsSchema }]),
    FieldSchemasModule,
    EntitySchemasModule,
    TranslationsModule
  ],
  controllers: [],
  providers: [ColorsRepository, GetColorService],
  exports: [ColorsRepository, GetColorService]
})
export class ColorsModule {}
