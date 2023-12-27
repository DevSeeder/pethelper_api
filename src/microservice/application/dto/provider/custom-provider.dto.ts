import { Provider } from '@nestjs/common';

export interface CustomProvider {
  get?: { new (...args: any[]) };
  update?: Provider;
  create?: Provider;
}
