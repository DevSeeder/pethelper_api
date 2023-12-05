import { DomainBodyDto } from './domain-body.dto';

export interface AnimalBodyDto extends DomainBodyDto {
  name: string;
  key: string;
  idGroup: string;
  exotic?: boolean;
}
