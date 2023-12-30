import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {
  ErrorService,
  GetTranslationService
} from '@devseeder/nestjs-microservices-schemas';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { AbstractUpdateController } from '../abstract/abstract-update.controller';
import { GenericUpdateService } from 'src/microservice/application/service/abstract/generic-update.service';
import { ActivationQueryParams } from 'src/microservice/application/dto/query/activation-query-params.dto';
import { MyJwtAuthGuard } from 'src/core/auth/jwt.auth';
import { MetaScope } from 'src/core/auth/meta-scope/meta-scope.decorator';
import { MetaDataInterceptor } from 'src/core/interceptor/meta-data.interceptor';
import {
  EntitySchema,
  FieldSchema
} from '@devseeder/nestjs-microservices-schemas';

const allKey = 'UPDATE';

export function GenericUpdateController<
  Collection,
  GetResponse,
  SearchParams,
  BodyDto
>({ entity }: { entity: string }) {
  @UseInterceptors(MetaDataInterceptor)
  @Controller(entity.toLowerCase())
  class GenericUpdateControllerHost extends AbstractUpdateController<
    Collection,
    GetResponse,
    SearchParams,
    BodyDto
  > {
    constructor(
      @Inject(`GENERIC_UPDATE_SERVICE_${entity}`)
      readonly updateService?: GenericUpdateService<
        Collection,
        GetResponse,
        BodyDto,
        SearchParams
      >,
      @Inject(DependecyTokens.FIELD_SCHEMA_DB)
      readonly fieldSchemaData?: FieldSchema[],
      @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
      readonly entitySchemaData?: EntitySchema[],
      readonly errorService?: ErrorService,
      readonly translationService?: GetTranslationService
    ) {
      super(
        entity,
        updateService,
        fieldSchemaData,
        entitySchemaData,
        errorService,
        translationService
      );
    }

    @UseGuards(MyJwtAuthGuard)
    @MetaScope({ entity, accessKey: 'INACTIVATE' })
    @Patch(`inactivate/:id`)
    async inactivate(
      @Param('id') id: string,
      @Query() queryParams: ActivationQueryParams
    ): Promise<void> {
      this.isMethodAllowed('inactivate');
      await this.schemaValidator.validateRequestSchema(
        this.requestSchema,
        'activation',
        queryParams
      );
      await this.updateService.activation(
        id,
        false,
        queryParams.cascadeRelations
      );
    }

    @UseGuards(MyJwtAuthGuard)
    @MetaScope({ entity, accessKey: 'ACTIVATE' })
    @Patch(`activate/:id`)
    async activate(
      @Param('id') id: string,
      @Query() queryParams: ActivationQueryParams
    ): Promise<void> {
      this.isMethodAllowed('activate');
      await this.schemaValidator.validateRequestSchema(
        this.requestSchema,
        'activation',
        queryParams
      );
      await this.updateService.activation(
        id,
        true,
        queryParams.cascadeRelations
      );
    }

    @UseGuards(MyJwtAuthGuard)
    @MetaScope({ entity, accessKey: 'UPDATE_BY_ID' })
    @Patch(`/:id`)
    async updateById(
      @Param('id') id: string,
      @Body() body: BodyDto
    ): Promise<void> {
      this.isMethodAllowed('updateById');
      await this.schemaValidator.validateRequestSchema(
        this.requestSchema,
        'update',
        body,
        this.fieldSchemaData
      );
      await this.updateService.updateById(id, body as unknown as BodyDto);
    }

    @UseGuards(MyJwtAuthGuard)
    @MetaScope({ entity, accessKey: 'UPDATE_MANY' })
    @Patch(`/`)
    async updateBy(
      @Query() params: SearchParams,
      @Body() body: BodyDto
    ): Promise<void> {
      this.isMethodAllowed('updateBy');
      await this.schemaValidator.validateRequestSchema(
        this.requestSchema,
        'search',
        params,
        [],
        true
      );
      await this.schemaValidator.validateRequestSchema(
        this.requestSchema,
        'update',
        body,
        this.fieldSchemaData
      );
      await this.updateService.updateBy(params, body);
    }
  }

  Object.defineProperty(GenericUpdateControllerHost, 'name', {
    value: `Generic${entity.capitalizeFirstLetter()}UpdateController`
  });

  return GenericUpdateControllerHost;
}
