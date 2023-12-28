import { NotFoundException } from '@devseeder/microservices-exceptions';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { ForbiddenActionException } from '../../../../../core/exceptions/forbbiden-action.exception';
import { UsersRepository } from '../../../../adapter/repository/entity/users.repository';
import { User } from '../../../../domain/schemas/entity/users.schema';

@Injectable()
export abstract class UsersService extends AbstractService {
  constructor(protected readonly usersRepository: UsersRepository) {
    super();
  }

  async validateUser(id: number, usernameToValidate = ''): Promise<User> {
    const res = await this.getUserById(id);
    if (!res) throw new NotFoundException('User');

    if (usernameToValidate.length > 0 && usernameToValidate !== res.username)
      throw new ForbiddenActionException(
        'This user is not allowed to do this action'
      );
    return res;
  }

  async getUserById(id: number): Promise<User> {
    return this.usersRepository.getUserById(id);
  }
}
