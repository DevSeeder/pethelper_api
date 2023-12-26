import { Module } from '@nestjs/common';
import {
  Color,
  ColorsSchema
} from 'src/microservice/domain/schemas/entity/colors.schema';
import { GetColorService } from 'src/microservice/application/service/entity/colors/get-color.service';
import { FieldSchemasModule } from '../configuration/field-schemas.module';
import { EntitySchemasModule } from '../configuration/entity-schemas.module';
import { TranslationsModule } from '../translation/translation.module';
import { ErrorSchemasModule } from '../configuration/error-schemas.module';
import { GenericModule } from '../generic.module';

@Module({
  imports: [
    GenericModule.forFeature(Color.name, ColorsSchema),
    // MongooseModule.forFeature([{ name: Color.name, schema: ColorsSchema }]),
    FieldSchemasModule,
    EntitySchemasModule,
    TranslationsModule,
    ErrorSchemasModule
  ],
  controllers: [],
  providers: [GetColorService],
  exports: [GetColorService]
})
export class ColorsModule {}
