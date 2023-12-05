/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractSchema } from '../abstract.schema';

export type DomainDocument = AbstractDomain & Document;

export abstract class AbstractDomain extends AbstractSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  key: string;
}
