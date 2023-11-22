import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserAuth } from '../../../domain/model/auth/user-auth.model';
import { HttpClientService } from '../../../application/service/client/http-client.service';

@Injectable()
export class ClientAuthService extends HttpClientService {
  private token: string;

  constructor(
    protected readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    super(configService.get('auth.url'), httpService);
    this.token = this.configService.get('auth.clientToken');
  }

  protected getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`
    };
  }

  async createUser(user: UserAuth): Promise<any> {
    const response = await this.post('/users/create', user);
    return response.data;
  }
}
