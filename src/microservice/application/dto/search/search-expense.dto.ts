import { Search } from '@devseeder/nestjs-microservices-commons';

export class SearchExpenseDto extends Search {
  name?: string;
  description?: string;
  userId?: string;
  pets?: string[];
  idCategory?: string;
  date_start?: string;
  date_end?: string;
}
