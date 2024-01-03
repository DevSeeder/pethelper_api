import { Search } from '@devseeder/nestjs-microservices-commons';
import { SexEnum } from 'src/microservice/domain/enum/sex.enum';

export class SearchPetDto extends Search {
  name?: string;
  sex?: SexEnum;
  userId?: string;
  idAnimal?: string;
  race?: string;
}
