import { RelationField } from 'src/microservice/domain/interface/relation-field.interface';

export interface PetResponse {
  _id: string;
  name: string;
  sex: string;
  birthDate?: string;
  color?: RelationField;
  weight?: number;
  height?: number;
  idAnimal: RelationField;
  races?: RelationField[];
  userId: string;
}
