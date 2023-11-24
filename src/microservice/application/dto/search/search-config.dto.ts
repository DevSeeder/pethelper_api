import { SexEnum } from 'src/microservice/domain/enum/sex.enum';
import { Search } from './search.dto';

export class SearchConfigDto extends Search {
  name?: string;
  key?: SexEnum;
}
