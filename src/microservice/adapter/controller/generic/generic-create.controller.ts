import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { AbstractCreateController } from '../abstract/abstract-create.controller';
import { GenericCreateService } from 'src/microservice/application/service/abstract/generic-create.service';
import { ObjectId } from 'mongoose';
import {
  ClonyManyBodyDto,
  ClonyOneBodyDto
} from 'src/microservice/application/dto/body/clone-body.dto';
import {
  CloneManyResponse,
  CloneOneResponse
} from 'src/microservice/application/dto/response/clone.response';
import { MyJwtAuthGuard } from 'src/core/auth/jwt.auth';
import { MetaScope } from 'src/core/auth/meta-scope/meta-scope.decorator';
import { MetaDataInterceptor } from 'src/core/interceptor/meta-data.interceptor';
import {
  EntitySchema,
  FieldSchema
} from '@devseeder/nestjs-microservices-schemas';

const allKey = 'CREATE';

export function GenericCreateController<
  Collection,
  GetResponse,
  SearchParams,
  BodyDto
>({ entity }: { entity: string }) {
  @UseInterceptors(MetaDataInterceptor)
  @Controller(entity.toLowerCase())
  class GenericCreateControllerHost extends AbstractCreateController<
    Collection,
    GetResponse,
    SearchParams,
    BodyDto
  > {
    constructor(
      @Inject(`GENERIC_CREATE_SERVICE_${entity}`)
      readonly createService?: GenericCreateService<
        Collection,
        GetResponse,
        BodyDto
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
        createService,
        fieldSchemaData,
        entitySchemaData,
        errorService,
        translationService
      );
    }

    @UseGuards(MyJwtAuthGuard)
    @MetaScope({ entity, accessKey: 'CREATE' })
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

    @UseGuards(MyJwtAuthGuard)
    @MetaScope({ entity, accessKey: 'CLONE_ONE' })
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

    @UseGuards(MyJwtAuthGuard)
    @MetaScope({ entity, accessKey: 'CLONE_MANY' })
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

  Object.defineProperty(GenericCreateControllerHost, 'name', {
    value: `Generic${entity.capitalizeFirstLetter()}CreateController`
  });

  return GenericCreateControllerHost;
}
