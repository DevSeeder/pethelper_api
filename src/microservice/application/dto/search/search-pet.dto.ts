import { Search } from './search.dto';

export class SearchPetDto extends Search {
  name?: string;
  sex?: string;
  userId?: string;
  idAnimal?: string;
  race?: string;
  active?: boolean;
}
