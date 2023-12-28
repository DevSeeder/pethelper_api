import { Logger } from '@nestjs/common';
import { GLOBAL_ENTITY } from 'src/microservice/application/app.constants';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';

export abstract class AbstractEntityLoader {
  readonly logger: Logger = new Logger(AbstractEntityLoader.name);
  entitySchema: EntitySchema;
  entityLabels: string[];
  fieldSchemaDb: FieldSchema[];

  constructor(
    readonly entity: string,
    readonly fieldSchemaData?: FieldSchema[],
    readonly entitySchemaData?: EntitySchema[]
  ) {
    this.entitySchema = entitySchemaData.filter(
      (ent) => ent.entity === entity
    )[0];

    this.entityLabels = [
      this.entitySchema.entity,
      ...(this.entitySchema.extendedEntities || [])
    ];

    if (!this.fieldSchemaData || !this.fieldSchemaData.length) return;

    this.fieldSchemaDb = this.fieldSchemaData.filter(
      (schema) =>
        this.entityLabels.includes(schema.entity) ||
        schema.entity === GLOBAL_ENTITY ||
        schema.entity == this.entitySchema.entity
    );
  }
}
