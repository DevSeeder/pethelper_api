import { Injectable } from '@nestjs/common';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import {
  AnimalGroup,
  AnimalGroupDocument
} from '../../../../domain/schemas/animal-group.schema';
import { AnimalGroupsRepository } from 'src/microservice/adapter/repository/animal-groups.repository';
import { SearchConfigDto } from '../../../dto/search/search-config.dto';

@Injectable()
export class GetAnimalGroupService extends AbstractGetService<
  AnimalGroup,
  AnimalGroupDocument,
  AnimalGroup,
  SearchConfigDto
> {
  constructor(protected readonly repository: AnimalGroupsRepository) {
    super(repository);
  }
}
