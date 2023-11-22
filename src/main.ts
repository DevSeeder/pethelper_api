import {
  CustomErrorExceptionFilter,
  HttpExceptionFilter
} from '@devseeder/microservices-exceptions';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './microservice/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get<ConfigService>(ConfigService);

  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(adapterHost));
  app.useGlobalFilters(new CustomErrorExceptionFilter(adapterHost));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get<string>('api.port'));
}
bootstrap();
