import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColorsRepository } from 'src/microservice/adapter/repository/colors.repository';
import {
  Color,
  ColorsSchema
} from 'src/microservice/domain/schemas/colors.schema';
import { GetColorService } from 'src/microservice/application/service/entity/colors/get-color.service';
import { FieldSchemasModule } from '../configuration/field-schemas.module';
import { importAsyncService } from '../../helper/init-service-module.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Color.name, schema: ColorsSchema }]),
    FieldSchemasModule
  ],
  controllers: [],
  providers: [ColorsRepository, importAsyncService(GetColorService)],
  exports: [ColorsRepository, GetColorService]
})
export class ColorsModule {}
