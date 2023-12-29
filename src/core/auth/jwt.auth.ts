import { CustomJwtAuthGuard } from '@devseeder/nestjs-microservices-core';
import {
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {
  EnumScopes,
  SCOPE_KEY
} from '../../microservice/domain/enum/enum-scopes.enum';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { MetaScopeInfo } from './meta-scope/meta-scope.decorator';

@Injectable()
export class MyJwtAuthGuard extends CustomJwtAuthGuard {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData: EntitySchema[]
  ) {
    super(reflector, jwtService, configService, EnumScopes.ADM);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const bearerToken = this.getAuthToken(context, 'Bearer').replace(
        'Bearer ',
        ''
      );
      const tokenPayload = await this.jwtService.verifyAsync(bearerToken, {
        secret: this.configService.get<string>('auth.jwt.secret'),
        ignoreExpiration: true
      });

      const metaScope = this.reflector.get<MetaScopeInfo>(
        'metaScopes',
        context.getHandler()
      );

      if (!metaScope || !Object.keys(metaScope).length) return true;

      if (tokenPayload.scopes.indexOf(this.scopeADM) !== -1) return true;

      const scopes = this.getScopes(metaScope);

      let scopesPermission = 0;
      scopes.forEach((scope) => {
        if (tokenPayload.scopes.indexOf(scope) > -1) scopesPermission++;
      });

      if (!scopesPermission)
        throw new ForbiddenException('Missing Scope Authorization');

      return true;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status === HttpStatus.ACCEPTED
          ? HttpStatus.UNAUTHORIZED
          : err.status
      );
    }
  }

  private getScopes(metaScopeInfo: MetaScopeInfo): string[] {
    const entitySchema = this.entitySchemaData.filter(
      (ent) => metaScopeInfo.entity === ent.entity
    );
    if (!entitySchema.length) return [];
    const requestScopes = entitySchema[0].authScopes.filter(
      (req) => req.accessKey === metaScopeInfo.accessKey
    );
    if (!requestScopes.length) return [];
    const schemaScopes = requestScopes[0].scopes.map(
      (scope) => `${SCOPE_KEY}/${scope.key}`
    );
    return [
      ...schemaScopes,
      `${SCOPE_KEY}/${metaScopeInfo.entity.toUpperCase()}/${metaScopeInfo.accessKey.toUpperCase()}`
    ];
  }
}
