import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../domain/schemas/users.schema';
import { GenericRepository } from '@devseeder/nestjs-microservices-commons';

@Injectable()
export class UsersRepository extends GenericRepository<User> {
  constructor(
    @InjectModel(User.name)
    model: Model<UserDocument>
  ) {
    super(model);
  }

  async getUserById(id: number): Promise<User> {
    const result = await this.model.findOne({ id });
    return result;
  }

  async getUserByEmail(username: string): Promise<User> {
    const result = await this.model.findOne({
      username,
      active: true
    });
    return result;
  }

  async getInfoTeamById(id: number, field = 'name'): Promise<any> {
    const select = {};
    select[field] = 1;

    const result = await this.model.findOne({ id }, select);
    return result[field];
  }

  async getLastId(): Promise<number> {
    const last = await this.model
      .findOne({}, { id: 1 })
      .sort({ id: -1 })
      .limit(1);

    if (!last) return 0;

    return last.id;
  }
}
