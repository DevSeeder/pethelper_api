import { Body, Param, Post } from '@nestjs/common';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { SchemaValidator } from 'src/microservice/application/helper/validator/schema-validator.helper';
import { RequestSchema } from 'src/microservice/domain/interface/input-schema.interface';
import { GenericCreateService } from 'src/microservice/application/service/abstract/generic-create.service';
import { AbstractBodyDto } from 'src/microservice/application/dto/body/abtract-body.dto';
import { ObjectId } from 'mongoose';
import {
  ClonyManyBodyDto,
  ClonyOneBodyDto
} from 'src/microservice/application/dto/body/clone-body.dto';
import {
  CloneManyResponse,
  CloneOneResponse
} from 'src/microservice/application/dto/response/clone.response';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';
import { AbstractController } from './abstract.controller';

export abstract class AbstractCreateController<
  Collection,
  GetResponse,
  SearchParams extends Search,
  BodyDto extends AbstractBodyDto
> extends AbstractController<Collection, GetResponse, SearchParams, BodyDto> {
  requestSchema: RequestSchema;
  schemaValidator: SchemaValidator;

  constructor(
    readonly entity: string,
    readonly createService?: GenericCreateService<
      Collection,
      GetResponse,
      BodyDto
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

  @Post(`/`)
  async create(@Body() body: BodyDto): Promise<{ _id: ObjectId }> {
    this.isMethodAllowed('create');
    await this.schemaValidator.validateRequestSchema(
      this.requestSchema,
      'create',
      body,
      this.fieldSchemaData
    );
    return this.createService.create(body as unknown as BodyDto);
  }

  @Post(`/clone/:id`)
  async cloneById(
    @Param('id') id: string,
    @Body() body: ClonyOneBodyDto
  ): Promise<CloneOneResponse> {
    this.isMethodAllowed('cloneById');
    await this.schemaValidator.validateRequestSchema(
      this.requestSchema,
      'cloneOne',
      body,
      this.fieldSchemaData
    );
    const response = await this.createService.cloneByIds(
      [id],
      body.cloneRelations,
      body.replaceBody
    );
    return response[0];
  }

  @Post(`/clone`)
  async cloneManyByIds(
    @Body()
    body: ClonyManyBodyDto
  ): Promise<CloneManyResponse> {
    this.isMethodAllowed('cloneManyByIds');
    await this.schemaValidator.validateRequestSchema(
      this.requestSchema,
      'cloneMany',
      body,
      this.fieldSchemaData
    );
    return this.createService.cloneByIds(
      body._ids,
      body.cloneRelations,
      body.replaceBody
    );
  }
}
