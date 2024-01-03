import { Search } from '@devseeder/nestjs-microservices-commons';

export class SearchUser extends Search {
  name?: string;
  username?: string;
  idUserAuth?: string;
}
