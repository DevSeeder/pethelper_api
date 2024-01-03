import { DomainBodyDto } from '@devseeder/nestjs-microservices-commons';

export interface AnimalBodyDto extends DomainBodyDto {
  name: string;
  key: string;
  idGroup: string;
  exotic?: boolean;
}
