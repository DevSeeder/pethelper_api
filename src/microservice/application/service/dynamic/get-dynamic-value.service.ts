import { DynamicValuesEnum } from 'src/microservice/domain/enum/dynamic-values.enum';
import { DateHelper } from '../../helper/types/date.helper';
import { DEFAULT_LANG } from '../../app.constants';
import { GetTranslationService } from '../translation/get-translation.service';

export class DynamicValueService {
  constructor(protected readonly translationService: GetTranslationService) {}

  static getDynamicValue(
    dynamicValue: DynamicValuesEnum,
    value: any,
    item: object = {}
  ): any {
    if (typeof dynamicValue !== 'string') return value;

    if (value.startsWith('$')) return item[value.replace('$', '')];

    switch (dynamicValue) {
      case DynamicValuesEnum.CUR_DATETIME:
        return DateHelper.getDateNow();
      case DynamicValuesEnum.CUR_DATE:
        return DateHelper.formatDate(DateHelper.getDateNow(), 'YYYY-MM-DD');
      case DynamicValuesEnum.CUR_TIME:
        return DateHelper.formatDate(DateHelper.getDateNow(), 'HH:mm:ss');
      case DynamicValuesEnum.CUR_USER:
        return 1;
      default:
        return value;
    }
  }

  getValueMessage(dynamicValue: DynamicValuesEnum, value: any): any {
    if (typeof dynamicValue !== 'string') return value;

    if (value.startsWith('$')) return value.replace('$', '');

    switch (dynamicValue) {
      case DynamicValuesEnum.CUR_DATETIME:
      case DynamicValuesEnum.CUR_DATE:
      case DynamicValuesEnum.CUR_TIME:
      case DynamicValuesEnum.CUR_USER:
        return this.translationService.getServiceKeyTranslation(dynamicValue);
      default:
        return value;
    }
  }
}
