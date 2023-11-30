import { DynamicValuesEnum } from 'src/microservice/domain/enum/dynamic-values.enum';
import { DateHelper } from '../../helper/date.helper';

export class GetDynamicValueService {
  getDynamicValue(dynamicValue: DynamicValuesEnum, value: any): any {
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
}
