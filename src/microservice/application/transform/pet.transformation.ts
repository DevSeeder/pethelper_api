import { DBReference } from 'src/microservice/domain/interface/db-reference.interface';
import { AbstractTransformation } from './abstract.transformation';
import { SearchPetDto } from '../dto/search/search-pet.dto';
import {
  SearchEgineOperators,
  SearchEngine
} from 'src/microservice/domain/interface/search-engine.interface';

export class PetTransformation extends AbstractTransformation<SearchPetDto> {
  dbRefs: DBReference[] = [{ searchKey: 'race', dbKey: 'races' }];
}
