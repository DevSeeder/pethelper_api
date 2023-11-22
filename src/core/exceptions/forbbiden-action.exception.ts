import { CustomErrorException } from '@devseeder/microservices-exceptions';
import { HttpStatus } from '@nestjs/common';

export class ForbiddenActionException extends CustomErrorException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN, HttpStatus.FORBIDDEN);
  }
}
