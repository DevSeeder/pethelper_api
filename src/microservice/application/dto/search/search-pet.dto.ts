import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { Search } from './search.dto';
import { DBReference } from 'src/microservice/domain/interface/db-reference.interface';

export class SearchPetDto extends Search {
  dbRefs: DBReference[] = [{ searchKey: 'race', dbKey: 'races' }];

  @IsString()
  name?: string;

  @IsEnum(['M', 'F'])
  sex?: string;

  @IsString()
  userId?: string;

  @IsString()
  idAnimal?: string;

  @IsString()
  race?: string;

  @IsBoolean()
  active?: boolean;
}
