import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColorsRepository } from 'src/microservice/adapter/repository/colors.repository';
import {
  Color,
  ColorsSchema
} from 'src/microservice/domain/schemas/colors.schema';
import { GetColorService } from 'src/microservice/application/service/colors/get-color.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Color.name, schema: ColorsSchema }])
  ],
  controllers: [],
  providers: [ColorsRepository, GetColorService],
  exports: [ColorsRepository, GetColorService]
})
export class ColorsModule {}
