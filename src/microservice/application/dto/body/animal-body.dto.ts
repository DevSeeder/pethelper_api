import { ConfigBodyDto } from './config-body.dto';

export interface AnimalBodyDto extends ConfigBodyDto {
  name: string;
  key: string;
  idGroup: string;
  exotic?: boolean;
}
