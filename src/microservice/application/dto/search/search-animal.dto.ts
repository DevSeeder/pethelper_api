import { SearchDomainDto } from '@devseeder/nestjs-microservices-commons';

export class SearchAnimalDto extends SearchDomainDto {
  idGroup?: string;
  exotic?: boolean;
}
