/* eslint-disable @typescript-eslint/no-unused-vars */
import { AbstractSchema } from '@devseeder/nestjs-microservices-commons/dist/schema/abstract.schema';
import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DomainDocument = AbstractDomain & Document;

export abstract class AbstractDomain extends AbstractSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: false, default: [] })
  translations?: Translation[];
}

export interface Translation {
  locale: string;
  value: string;
}
