import { Injectable } from '@nestjs/common';
import { UsersMongoose } from '../../../adapter/repository/users.repository';
import {
  UpdateUserDTO,
  UserDTO
} from '../../../domain/model/dto/users/user.dto';
import { UsersService } from './user.service';

@Injectable()
export class UpdateUserService extends UsersService {
  constructor(protected readonly usersRepository: UsersMongoose) {
    super(usersRepository);
  }

  async updateUserName(
    id: number,
    user: UpdateUserDTO,
    loggedUsername: string
  ): Promise<void> {
    await this.validateUser(id, loggedUsername);
    await this.usersRepository.updateOne(
      {
        id
      },
      { name: user.name }
    );
  }

  async updateInactivateUser(
    id: number,
    loggedUsername: string
  ): Promise<void> {
    const validUser = await this.validateUser(id, loggedUsername);
    await this.usersRepository.updateOne(
      {
        id
      },
      { active: false }
    );
  }
}
