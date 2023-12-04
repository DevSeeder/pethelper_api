import { NotFoundException } from '@devseeder/microservices-exceptions';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../../adapter/repository/users.repository';
import { User } from '../../../../domain/schemas/entity/users.schema';
import { UsersService } from './user.service';

@Injectable()
export class GetUserValidationService extends UsersService {
  constructor(protected readonly usersRepository: UsersRepository) {
    super(usersRepository);
  }

  async getUserById(id: number): Promise<User> {
    return this.usersRepository.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User> {
    const res = await this.usersRepository.getUserByEmail(email);
    if (!res) {
      throw new NotFoundException('User');
    }
    return res;
  }

  async searchUserByUsername(name: string): Promise<User[]> {
    const regexName = new RegExp(name, 'i');
    return this.usersRepository.find(
      {
        $or: [
          { name: { $regex: regexName } },
          { username: { $regex: regexName } }
        ],
        active: true
      },
      { id: 1, username: 1, name: 1 },
      {},
      false
    );
  }
}
