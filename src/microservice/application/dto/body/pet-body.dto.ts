import { SexEnum } from 'src/microservice/domain/enum/sex.enum';
import { AbstractBodyDto } from './abtract-body.dto';

export interface PetBodyDto extends AbstractBodyDto {
  name: string;
  birthDate?: string;
  color?: string;
  weight?: number;
  height?: number;
  sex?: SexEnum;
  userId?: string;
  idAnimal: string;
  races?: string[];
}
