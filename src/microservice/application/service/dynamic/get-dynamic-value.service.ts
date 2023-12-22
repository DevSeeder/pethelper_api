import { DynamicValuesEnum } from 'src/microservice/domain/enum/dynamic-values.enum';
import { DateHelper } from '../../helper/types/date.helper';
import { DEFAULT_LANG } from '../../app.constants';

export class DynamicValueService {
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
  static getValueMessage(
    dynamicValue: DynamicValuesEnum,
    value: any,
    lang = DEFAULT_LANG
  ): any {
    if (typeof dynamicValue !== 'string') return value;

    if (value.startsWith('$')) return value.replace('$', '');

    switch (dynamicValue) {
      case DynamicValuesEnum.CUR_DATETIME:
        if (lang === 'pt-BR') return 'Data e hora atual';
        return 'Actual Datetime';
      case DynamicValuesEnum.CUR_DATE:
        if (lang === 'pt-BR') return 'Data atual';
        return 'Actual Date';
      case DynamicValuesEnum.CUR_TIME:
        if (lang === 'pt-BR') return 'Hora atual';
        return 'Actual Time';
      case DynamicValuesEnum.CUR_USER:
        if (lang === 'pt-BR') return 'Usuário atual';
        return 'Actual User';
      default:
        return value;
    }
  }
}
