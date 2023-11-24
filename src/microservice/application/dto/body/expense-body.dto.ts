import { SexEnum } from 'src/microservice/domain/enum/sex.enum';
import { AbstractBodyDto } from './abtract-body.dto';

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
