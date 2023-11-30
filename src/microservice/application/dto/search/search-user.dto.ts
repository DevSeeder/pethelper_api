import { Search } from './search.dto';

export class SearchUser extends Search {
  name?: string;
  username?: string;
  idUserAuth?: string;
}
