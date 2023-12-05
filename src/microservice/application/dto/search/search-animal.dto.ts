import { SearchDomainDto } from './search-domain.dto';

export class SearchAnimalDto extends SearchDomainDto {
  idGroup?: string;
  exotic?: boolean;
}
