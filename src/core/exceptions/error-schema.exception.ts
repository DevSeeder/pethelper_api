import { CustomErrorException } from '@devseeder/microservices-exceptions';

export class ErrorSchemaException extends CustomErrorException {
  private _type;
  constructor(message: string, status: number, errCode: number, type: string) {
    super(message, status, errCode);
    this._type = type;
  }

  get type() {
    return this._type;
  }
}
