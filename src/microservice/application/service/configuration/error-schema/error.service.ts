import { Inject, Injectable } from '@nestjs/common';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { ErrorSchema } from 'src/microservice/domain/schemas/configuration-schemas/error-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { GetTranslationService } from '../../translation/get-translation.service';
import {
  CustomErrorException,
  NotFoundException
} from '@devseeder/microservices-exceptions';
import { ErrorKeys } from 'src/microservice/domain/enum/error-keys.enum';
import { StringHelper } from 'src/microservice/application/helper/types/string.helper';

@Injectable()
export class ErrorService extends AbstractService {
  constructor(
    @Inject(DependecyTokens.ERROR_SCHEMA_DB)
    protected readonly errors: ErrorSchema[],
    protected readonly translationService: GetTranslationService
  ) {
    super();
  }

  throwError(
    errorKey: ErrorKeys,
    errorProps?: {
      key?: string;
      value?: string;
      pattern?: string;
    }
  ): void {
    const lang = this.translationService.getLang();
    this.logger.log(`Error Key: ${errorKey}`);
    const errorSchema = this.errors.filter((err) => err.key === errorKey);

    if (!errorSchema.length) throw new NotFoundException('Error Schema');

    let messageError = errorSchema[0].message;

    const errorTranslation = errorSchema[0].translations.filter(
      (tra) => tra.locale === lang
    );

    if (errorTranslation.length) messageError = errorTranslation[0].value;

    throw new CustomErrorException(
      StringHelper.replaceTemplateObject(messageError, errorProps),
      errorSchema[0].httpStatus,
      errorSchema[0].code
    );
  }
}
