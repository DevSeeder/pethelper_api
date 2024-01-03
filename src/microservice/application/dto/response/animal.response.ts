import { RelationField } from '@devseeder/nestjs-microservices-commons/dist/interface/relation-field.interface';

export interface AnimalResponse {
  _id: string;
  name: string;
  key: string;
  idGroup: RelationField;
}
