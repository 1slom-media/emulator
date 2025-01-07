import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { DataSource, Repository } from 'typeorm';
import { ApplicationIdeaEntity } from './entities/application.entity';
import {
  CreateApplicationIdeaDto,
  IdeaCardInfoDto,
  IdeaGetConfirmOtpDto,
  IdeaGetLimitDto,
  IdeaMyIdDto,
  IdeaVerifyCardDto,
} from './dto/application.dto';
import { ApiClientService } from '../../api-client/api-client.service';
import { convertImageToBase64 } from '../../utils/base-format';
import { maskPhoneNumber } from 'src/utils/mask';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectDataSource('secondary')
    private readonly secondaryDataSource: DataSource,
    @InjectRepository(ApplicationIdeaEntity, 'main')
    private readonly applicationRepo: Repository<ApplicationIdeaEntity>,
    private readonly apiService: ApiClientService,
    private readonly httpService: HttpService,
  ) {}

  async getOneId(app_id: string) {
    const app = await this.applicationRepo.findOne({
      where: { id: app_id },
    });
    return app;
  }

  async savePeriod(app_id: string, period: string) {
    const app = await this.applicationRepo.findOne({
      where: { id: app_id },
    });
    app.period = period;
    await this.applicationRepo.save(app);
  }

  // bincode card type
  async getBinCodes() {
    const reportsRepo = this.secondaryDataSource.getRepository('bin_codes');
    const query = `
SELECT id, card_type, prefix
FROM bin_codes;
`;
    return await reportsRepo.query(query);
  }

  //  1 step create
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

  //   2 step card info
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

      if (!response || response.message !== 'success') {
        return {
          success: false,
          message: 'Failed to update card details',
        };
      }

      app.card_number = data.card_number;
      app.expire = data.expire;
      app.application_id = response.result.application.id;
      await this.applicationRepo.save(app);

      const myIdData = {
        application_id: app.application_id,
        birth_date: app.birth_date,
        pass_data: `${app.passport_series}${app.passport_number}`,
        photo: app.photo,
      };
      const isIdenty = await this.verifyMyId(myIdData);

      if (isIdenty) {
        const binCodes = await this.getBinCodes();

        const cardPrefix = data.card_number.substring(0, 4);
        const binCode = binCodes.find((bin: any) => bin.prefix === cardPrefix);

        if (binCode && binCode.card_type === 'uzcard') {
          app.isUzcard = true;
          await this.applicationRepo.save(app);
        }
        return {
          success: true,
          phone: await maskPhoneNumber(app.phone),
          is_otp: true,
        };
      } else {
        return {
          success: false,
          message: 'ID verification failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'An unexpected error occurred.',
      };
    }
  }

  //   3 step MyId verify
  async verifyMyId(data: IdeaMyIdDto) {
    const fullImageUrl = `${process.env.IDEA_ANKETA_HOST}${data.photo}`;
    return true;
    // try {
    //   const base64Image = await convertImageToBase64(fullImageUrl);
    //   const body = {
    //     applicationId: data.application_id,
    //     birth_date: data.birth_date,
    //     pass_data: data.pass_data,
    //     photo_from_camera: { front: base64Image },
    //   };

    //   const response = await this.apiService.postApiWithToken(
    //     '/application/myid-identify',
    //     'IDEA',
    //     body,
    //   );
    //   console.log(response, 'ress Id');
    //   if (response.message === 'Success') {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // } catch (error) {
    //   console.error('Xatolik yuz berdi:', error.message);
    // }
  }

  // 4 step check card and verify 1-chi bank
  async verifyCard(data: IdeaVerifyCardDto) {
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
        id: app.application_id,
        otp: data.otp,
        type: app.isUzcard ? 'uzcard' : 'davr',
      };

      const response = await this.apiService.postApiWithToken(
        `/application/otp?type=${body.type}`,
        'IDEA',
        body,
      );

      console.log(response, `res ${body.type}`);

      if (response.statusCode === 201) {
        const result: any = { success: true };
        if (app.isUzcard) {
          result.phone = await maskPhoneNumber(app.phone);
          result.is_otp = true;
        }
        return result;
      }

      return {
        success: false,
        message: response.message,
      };
    } catch (error) {
      console.error('Error verifying card:', error);
      return {
        success: false,
        message: 'An error occurred while verifying the card',
      };
    }
  }

  // confirm card 2-step
  async confirmCard(data: IdeaVerifyCardDto) {
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
        id: app.application_id,
        otp: data.otp,
        type: 'davr',
      };

      const response = await this.apiService.postApiWithToken(
        `/application/otp?type=${body.type}`,
        'IDEA',
        body,
      );

      if (response.statusCode === 201) {
        return { success: true };
      }

      return {
        success: false,
        message: response.message || 'API request failed',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
      };
    }
  }
  // get limit
  async getLimit(data: IdeaGetLimitDto) {
    const app = await this.applicationRepo.findOne({
      where: { id: data.app_id },
    });

    if (!app) {
      return {
        success: false,
        message: 'Application not found',
      };
    }
    const response = await this.apiService.getApi(
      `/application/scoring/${app.application_id}`,
      'IDEA',
    );

    if (response.limit_amount > 0) {
      const periodSummResponse = await this.apiService.getApi(
        `/application/period-summ?modelId=129&modelName=merchant&summ=${response.limit_amount}`,
        'IDEA',
      );

      if (periodSummResponse.statusCode === 200 && periodSummResponse.result) {
        const limit = periodSummResponse.result.map((item) => ({
          month: item.period,
          amount: item.value,
        }));

        return {
          success: true,
          limit,
        };
      }

      return {
        success: false,
        message: 'Error fetching period-summ data',
      };
    } else {
      return {
        success: false,
        reject_reason: response.message || 'No limit available',
      };
    }
  }

  // application send-otp
  async getConfirmOtp(data: IdeaGetConfirmOtpDto) {
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

      const response = await this.apiService.postApiWithToken(
        `/application/approve/${app.application_id}`,
        'IDEA',
        { period: app.period },
      );

      const apiResponse = await this.apiService.getApi(
        `/application/get/status/${app.application_id}`,
        'IDEA',
      );
      const { is_anorbank_new_client } = apiResponse?.result;
      if (is_anorbank_new_client === true) {
        return {
          success: true,
          is_otp: true,
        };
      } else {
        return {
          success: true,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // verify otp
  async verifyOtp(data: IdeaVerifyCardDto) {
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
        id: app.application_id,
        otp: data.otp,
      };

      const response = await this.apiService.postApiWithToken(
        '/application/otp?type=new_client',
        'IDEA',
        body,
      );
      if (response.statusCode === 201) {
        return { success: true };
      }

      return {
        success: false,
        message: response.message || 'API request failed',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
      };
    }
  }
  // get grafik
  async getSchedule(data: IdeaGetLimitDto, res: Response) {
    const app = await this.applicationRepo.findOne({
      where: { id: data.app_id },
    });

    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const response = await this.apiService.getApi(
      `/application/schedule/${app.application_id}`,
      'IDEA',
    );

    const scheduleFileUrl = response?.result?.schedule_file;

    if (!scheduleFileUrl) {
      return res.status(404).json({
        success: false,
        message: 'Schedule file not found',
      });
    }

    try {
      const fileResponse = await this.httpService.axiosRef({
        url: scheduleFileUrl,
        method: 'GET',
        responseType: 'stream',
      });

      const safeFilename = encodeURIComponent(
        response.result.filename || 'schedule',
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${safeFilename}.pdf"`,
      );

      fileResponse.data.pipe(res);
    } catch (error) {
      console.error('Error downloading the schedule file:', error);
      return res.status(500).json({
        success: false,
        message: 'Error downloading the schedule file',
      });
    }
  }
}
