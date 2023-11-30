import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../../adapter/repository/users.repository';
import { User, UserDocument } from '../../../../domain/schemas/users.schema';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import { Search } from '../../../dto/search/search.dto';

@Injectable()
export class GetUserService extends AbstractGetService<
  User,
  UserDocument,
  User,
  Search
> {
  constructor(protected readonly usersRepository: UsersRepository) {
    super(usersRepository, 'User');
  }
}
