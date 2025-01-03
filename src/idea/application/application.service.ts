import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationIdeaEntity } from './entities/application.entity';
import {
  CreateApplicationIdeaDto,
  IdeaCardInfoDto,
} from './dto/application.dto';
import { ApiClientService } from 'src/api-client/api-client.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(ApplicationIdeaEntity, 'main')
    private readonly applicationRepo: Repository<ApplicationIdeaEntity>,
    private readonly apiService: ApiClientService,
  ) {}

  //  create
  async createApp(data: CreateApplicationIdeaDto) {
    try {
      const app = this.applicationRepo.create(data);
      await this.applicationRepo.save(app);

      return {
        success: true,
        app_id: app.id,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'An unexpected error occurred.',
      };
    }
  }

  //   card info
  async updateCardDetails(data: IdeaCardInfoDto) {
    try {
      const app = await this.applicationRepo.findOne({
        where: { id: data.app_id },
      });
      if (!app) {
        return {
          success: false,
          message: 'Application not found',
        };
      }

      const body = {
        owner_phone: app.phone,
        close_phone: app.additional_phone,
        card: data.card_number,
        card_expiry: data.expire,
      };

      const response = await this.apiService.postApiWithToken(
        '/api/merchants/application/user',
        'IDEA',
        body,
      );

      app.card_number = data.card_number;
      app.expire = data.expire;
      app.application_id = response.result.application.id;
      await this.applicationRepo.save(app);

      return app;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'An unexpected error occurred.',
      };
    }
  }
}
