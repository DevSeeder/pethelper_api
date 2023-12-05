import { SexEnum } from 'src/microservice/domain/enum/sex.enum';
import { Search } from './search.dto';

export class SearchDomainDto extends Search {
  name?: string;
  key?: SexEnum;
}
