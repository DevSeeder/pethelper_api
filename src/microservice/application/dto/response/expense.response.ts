import { RelationField } from 'src/microservice/domain/interface/relation-field.interface';

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
