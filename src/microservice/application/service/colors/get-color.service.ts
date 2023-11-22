import { Injectable } from '@nestjs/common';
import { AbstractGetService } from '../abstract/abstract-get.service';
import { Color, ColorDocument } from '../../../domain/schemas/colors.schema';
import { ColorsRepository } from 'src/microservice/adapter/repository/colors.repository';

@Injectable()
export class GetColorService extends AbstractGetService<
  Color,
  ColorDocument,
  Color,
  any
> {
  constructor(protected readonly repository: ColorsRepository) {
    super(repository);
  }
}
