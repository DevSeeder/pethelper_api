import { SexEnum } from 'src/microservice/domain/enum/sex.enum';
import { Search } from './search.dto';

export class SearchPetDto extends Search {
  name?: string;
  sex?: SexEnum;
  userId?: string;
  idAnimal?: string;
  race?: string;
}
