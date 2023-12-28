import { Body, Param, Patch, Query } from '@nestjs/common';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { SchemaValidator } from 'src/microservice/application/helper/validator/schema-validator.helper';
import { GenericUpdateService } from 'src/microservice/application/service/abstract/generic-update.service';
import { RequestSchema } from 'src/microservice/domain/interface/input-schema.interface';
import { AbstractBodyDto } from 'src/microservice/application/dto/body/abtract-body.dto';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { ActivationQueryParams } from 'src/microservice/application/dto/query/activation-query-params.dto';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';
import { AbstractController } from './abstract.controller';

export abstract class AbstractUpdateController<
  Collection,
  GetResponse,
  SearchParams extends Search,
  BodyDto extends AbstractBodyDto
> extends AbstractController<Collection, GetResponse, SearchParams, BodyDto> {
  requestSchema: RequestSchema;
  schemaValidator: SchemaValidator;

  constructor(
    readonly entity: string,
    readonly updateService?: GenericUpdateService<
      Collection,
      GetResponse,
      BodyDto,
      SearchParams
    >,
    readonly fieldSchemaData?: FieldSchema[],
    readonly entitySchemaData?: EntitySchema[],
    readonly errorService?: ErrorService,
    readonly translationService?: GetTranslationService
  ) {
    super(
      entity,
      fieldSchemaData,
      entitySchemaData,
      errorService,
      translationService
    );
  }

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
    await this.updateService.activation(id, true, queryParams.cascadeRelations);
  }

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
