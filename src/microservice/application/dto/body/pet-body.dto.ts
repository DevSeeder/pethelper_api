import { AbstractBodyDto } from '@devseeder/nestjs-microservices-commons';
import { SexEnum } from 'src/microservice/domain/enum/sex.enum';

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
