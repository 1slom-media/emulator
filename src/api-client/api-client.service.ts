import { forwardRef, Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AuthService } from '../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiLogEntity } from './entities/api-client';

@Injectable()
export class ApiClientService {
  private readonly axiosInstance: AxiosInstance;
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(ApiLogEntity, 'main')
    private readonly apiRepo: Repository<ApiLogEntity>,
  ) {
    this.axiosInstance = axios.create({
      baseURL: process.env.BACKEND_URL,
    });
  }

  async getApi(url: string, brokerType: string) {
    try {
      const token = await this.authService.getAccessToken(brokerType);

      const response = await this.axiosInstance({
        method: 'get',
        url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = {
        url,
        brokerType,
        response: response.data,
      };
      await this.apiRepo.save(data);

      return response.data;
    } catch (error: any) {
      const data = {
        url,
        brokerType,
        response: error.response?.data?.message || error.message,
      };
      await this.apiRepo.save(data);
      // TypeScript'da error'ni aniqlash
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Unknown error occurred';
      throw new Error(`API request failed: ${errorMessage}`);
    }
  }

  async postApiWithToken(url: string, brokerType: string, data: any) {
    try {
      const token = await this.authService.getAccessToken(brokerType);
      const response = await this.axiosInstance({
        method: 'post',
        url,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data,
      });

      const body = {
        url,
        brokerType,
        data,
        response: response.data,
      };
      await this.apiRepo.save(body);

      return response.data;
    } catch (error: any) {
      const body = {
        url,
        brokerType,
        data,
        response: error.response?.data,
      };
      await this.apiRepo.save(body);
      return error.response?.data;
    }
  }

  async postApi(url: string, data: any) {
    try {
      const response = await this.axiosInstance({
        method: 'post',
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      });
      const body = {
        url,
        data,
        response: response.data,
      };
      await this.apiRepo.save(body);

      return response.data;
    } catch (error: any) {
      const body = {
        url,
        data,
        response: error.response?.data?.message || error.message,
      };
      await this.apiRepo.save(body);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Unknown error occurred';
      throw new Error(`API request failed: ${errorMessage}`);
    }
  }

  async putApiWithToken(url: string, brokerType: string, data: any) {
    try {
      const token = await this.authService.getAccessToken(brokerType);
      const response = await this.axiosInstance({
        method: 'put',
        url,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data,
      });

      const body = {
        url,
        brokerType,
        data,
        response: response.data,
      };
      await this.apiRepo.save(body);

      return response.data;
    } catch (error: any) {
      const body = {
        url,
        brokerType,
        data,
        response: error.response?.data,
      };
      await this.apiRepo.save(body);
      return error.response?.data;
    }
  }
}
