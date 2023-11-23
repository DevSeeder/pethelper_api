import { SexEnum } from 'src/microservice/domain/enum/sex.enum';

export interface PetBodyDto {
  name: string;
  birthDate?: string;
  color?: string;
  weight?: number;
  height?: number;
  sex?: SexEnum;
  userId: string;
  idAnimal: string;
  races?: string[];
}
