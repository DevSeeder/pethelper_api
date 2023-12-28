import { CustomJwtAuthGuard } from '@devseeder/nestjs-microservices-core';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { EnumScopes } from '../../microservice/domain/enum/enum-scopes.enum';
import { ForbiddenActionException } from '../exceptions/forbbiden-action.exception';

@Injectable()
export class MyJwtAuthGuard extends CustomJwtAuthGuard {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService
  ) {
    super(reflector, jwtService, configService, EnumScopes.ADM);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const active = await super.canActivate(context);
      return active;
    } catch (err) {
      throw new ForbiddenActionException(
        err.message.replace('Error JWT Auth: ', '')
      );
    }
  }
}
