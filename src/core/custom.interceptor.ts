import { MetaDataInterceptor } from '@devseeder/nestjs-microservices-core';
import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CustomInterceptor extends MetaDataInterceptor {
  constructor(protected readonly reflector: Reflector) {
    super(reflector);
  }
}
