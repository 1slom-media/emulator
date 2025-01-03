import { forwardRef, Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ApiClientService {
  private readonly axiosInstance: AxiosInstance;

  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
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

      return response.data;
    } catch (error: any) {
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

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Unknown error occurred';
      throw new Error(`API request failed: ${errorMessage}`);
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

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Unknown error occurred';
      throw new Error(`API request failed: ${errorMessage}`);
    }
  }
}
