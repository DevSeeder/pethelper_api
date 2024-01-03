import { RelationField } from '@devseeder/nestjs-microservices-commons/dist/interface/relation-field.interface';

export interface ExpenseResponse {
  _id: string;
  name: string;
  description?: string;
  idCategory: RelationField;
  cost?: number;
  qtd?: number;
  date: Date;
  pets?: RelationField[];
  userId: string;
}
