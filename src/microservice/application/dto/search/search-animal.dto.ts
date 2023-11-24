import { SearchConfigDto } from './search-config.dto';

export class SearchAnimalDto extends SearchConfigDto {
  idGroup?: string;
  exotic?: boolean;
}
