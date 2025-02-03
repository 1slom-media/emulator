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
  IdeaResendOtpDto,
  IdeaVerifyCardDto,
} from './dto/application.dto';
import { ApiClientService } from '../../api-client/api-client.service';
import { convertImageToBase64 } from '../../utils/base-format';
import { maskPhoneNumber } from '../../utils/mask';

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
  // aplication db get one
  async appGetOne(id: string) {
    const reportsRepo = this.secondaryDataSource.getRepository('applications');
    const query = `
        SELECT id, status, state
        FROM applications WHERE id = $1;
    `;
    const result = await reportsRepo.query(query, [id]);
    return result.length > 0 ? result[0] : null;
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
      app.application_id = response.result.app.id;
      // app.application_id = response.result.application.id;
      await this.applicationRepo.save(app);

      const myIdData = {
        application_id: app.application_id,
        birth_date: app.birth_date,
        pass_data: `${app.passport_series}${app.passport_number}`,
        photo: app.photo,
      };
      const isIdenty = await this.verifyMyId(myIdData);

      if (isIdenty.success) {
        await this.typeB(app.id);
        const binCodes = await this.getBinCodes();
        const cardPrefix = data.card_number.substring(0, 4);
        const binCode = binCodes.find((bin: any) => bin.prefix === cardPrefix);

        if (!binCode) {
          return {
            success: false,
            message: 'Данные карты неверны.',
            error_type: 'card',
          };
        }

        if (binCode.card_type === 'uzcard') {
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
          message: isIdenty.message,
          error_type: 'myid',
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
    // return {
    //   success: true,
    //   message:"a"
    // };
    try {
      const base64Image = await convertImageToBase64(fullImageUrl);
      const body = {
        applicationId: data.application_id,
        birth_date: data.birth_date,
        pass_data: data.pass_data,
        photo_from_camera: { front: base64Image },
      };
      const responseApi = await this.apiService.postApiWithToken(
        '/application/myid-identify',
        'IDEA',
        body,
      );
      const { response } = responseApi;
      if (responseApi.status === 'open') {
        return {
          success: true,
        };
      } else {
        const errorMessages =
          response?.detail
            ?.map((err: { msg: string }) => err.msg)
            ?.join(', ') || 'Noma’lum xatolik yuz berdi';
        return {
          success: false,
          message: `ID verification failed : ${errorMessages}`,
        };
      }
    } catch (error) {
      console.error('Xatolik yuz berdi:', error.message);
    }
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
        id: parseInt(app.application_id),
        otp: data.otp,
        type: app.isUzcard ? 'uzcard' : 'davr',
      };
      console.log(body, 'bd');

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
        id: parseInt(app.application_id),
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
    const appDB = await this.appGetOne(app.application_id);

    if (response.limit_amount > 0) {
      let limit = [];

      if (response.provider === 'ANORBANK') {
        limit = [
          { month: 6, amount: response.limit_amount },
          { month: 12, amount: response.limit_amount },
        ];
      } else if (response.provider === 'DAVRBANK') {
        limit = [
          { month: 6, amount: String((response.limit_amount / 12) * 6) },
          { month: 12, amount: String(response.limit_amount) },
        ];
      }

      return {
        success: true,
        limit,
      };
    } else if (appDB.state == 'failed' || appDB.status != 'scoring') {
      return {
        success: 'fail',
        message: response.message || 'No limit available',
      };
    } else {
      return {
        success: false,
        message: response.message || 'No limit available',
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
          is_otp: false,
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

  async typeB(app_id: string) {
    const app = await this.applicationRepo.findOne({
      where: { id: app_id },
    });

    if (!app) {
      return {
        success: false,
        message: 'Application not found',
      };
    }

    const body = {
      categoryType: 'B',
    };

    const response = await this.apiService.putApiWithToken(
      `/application/applications/${app.application_id}`,
      'IDEA',
      body,
    );

    if (response?.statusCode === 200 && response?.result?.categoryType) {
      app.categoryType = response.result.categoryType;
      await this.applicationRepo.save(app);
      return {
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
  }

  async resendOtp(data: IdeaResendOtpDto) {
    const app = await this.applicationRepo.findOne({
      where: { id: data.app_id },
    });

    if (!app) {
      return {
        success: false,
        message: 'Application not found',
      };
    }
    let type = 'davr';
    if (app.isUzcard && data.type == '1') {
      type = 'anor';
    }

    const response = await this.apiService.getApi(
      `/application/resend/${app.application_id}?type=${type}`,
      'IDEA',
    );

    if (response.statusCode == 200) {
      return {
        success: true,
      };
    }
    return {
      success: false,
    };
  }

  async rejectApp(data: IdeaGetConfirmOtpDto) {
    const app = await this.applicationRepo.findOne({
      where: { id: data.app_id },
    });

    if (!app) {
      return {
        success: false,
        message: 'Application not found',
      };
    }

    const response = await this.apiService.putApiWithToken(
      `/application/reject/${app.application_id}`,
      'IDEA',
      { reject_reason: 'Клиент отказался' },
    );
    if (response.reason_of_reject == 'Клиент отказался') {
      return {
        success: true,
      };
    }
    return {
      success: false,
    };
  }

  async deleteProductByAppId(data: IdeaGetConfirmOtpDto) {
    const app = await this.applicationRepo.findOne({
      where: { id: data.app_id },
    });

    if (!app) {
      return {
        success: false,
        message: 'Application not found',
      };
    }

    const response = await this.apiService.deleteApiWithToken(
      `/application/reject/${app.application_id}`,
      'IDEA',
    );
    if (response.statusCode == true) {
      return {
        success: true,
      };
    }
    return {
      success: false,
      message: response.message,
    };
  }
}
