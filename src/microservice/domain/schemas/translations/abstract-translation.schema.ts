import { Prop } from '@nestjs/mongoose';
import { AbstractSchema } from '../abstract.schema';
import { PROJECT_KEY } from 'src/microservice/application/app.constants';

export abstract class AbstractTranslation extends AbstractSchema {
  @Prop({ required: true, default: PROJECT_KEY })
  projectKey: string;

  @Prop({ required: true })
  locale: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  translation: string;

  @Prop()
  context?: string;

  @Prop()
  source?: string;

  @Prop()
  quality?: number;
}
