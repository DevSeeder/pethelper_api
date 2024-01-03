import { AbstractBodyDto } from '@devseeder/nestjs-microservices-commons';

export interface ExpenseBodyDto extends AbstractBodyDto {
  name: string;
  description?: string;
  idCategory: string;
  cost?: number;
  qtd?: number;
  date?: Date;
  pets: string[];
  userId?: string;
}
