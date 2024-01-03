import { RelationField } from '@devseeder/nestjs-microservices-commons/dist/interface/relation-field.interface';
import { SexEnum } from 'src/microservice/domain/enum/sex.enum';

export interface PetResponse {
  _id: string;
  name: string;
  sex: SexEnum;
  birthDate?: string;
  color?: RelationField;
  weight?: number;
  height?: number;
  idAnimal: RelationField;
  races?: RelationField[];
  userId: string;
}
