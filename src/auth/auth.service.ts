import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaAuthEntity } from './entities/idea.entity';
import { IdeaAuthDto, IdeaRegisterDto } from './dto/idea.dto';
import { comparePasswords, hashPassword } from '../utils/hash';
import { ApiClientService } from '../api-client/api-client.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(IdeaAuthEntity, 'main')
    private readonly authIdeaRepo: Repository<IdeaAuthEntity>,
    @Inject(forwardRef(() => ApiClientService))
    private readonly apiService: ApiClientService,
  ) {}

  //   tokenni olish
  async getAccessToken(type: string): Promise<string> {
    if (type === 'IDEA') {
      const auth = await this.authIdeaRepo.findOneBy({ login: 'idea-admin' });
      if (!auth) {
        throw new Error('Authentication data not found');
      }
      return auth.access_token;
    }
  }

  //   IDEA
  async loginIdea(data: IdeaAuthDto) {
    const broker = await this.authIdeaRepo.findOneBy({ login: data.login });
    if (!broker) {
      throw new UnauthorizedException('Broker not found');
    }

    const isMatch = await comparePasswords(data.password, broker.password);
    if (!isMatch) {
      throw new UnauthorizedException('wrong Login or Password');
    }

    const response = await this.apiService.postApi('/auth/broker-login', {
      broker_key: broker.broker_key,
    });

    broker.access_token = response.result.access_token;
    await this.authIdeaRepo.save(broker);

    return {
      success: true,
      access_token: broker.access_token,
      expire: 43200,
    };
  }

  async registerIdea(data: IdeaRegisterDto) {
    const broker = await this.authIdeaRepo.findOneBy({ login: data.login });
    if (broker) {
      throw new Error('Authorization error: Broker already exists');
    }

    data.password = await hashPassword(data.password);
    const newBroker = await this.authIdeaRepo.save(data);
    return newBroker;
  }
}
