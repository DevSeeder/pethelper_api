import { Injectable } from '@nestjs/common';
import { GetFieldSchemaService } from './get-field-schemas.service';

@Injectable()
export class FieldSchemaDataService {
  constructor(protected readonly getService: GetFieldSchemaService) {}

  async loadData(): Promise<any[]> {
    return this.getService.getAll();
  }
}
