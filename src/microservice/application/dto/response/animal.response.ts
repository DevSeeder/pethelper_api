import { RelationField } from 'src/microservice/domain/interface/relation-field.interface';

export interface AnimalResponse {
  _id: string;
  name: string;
  key: string;
  idGroup: RelationField;
}
