import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ApplicationService } from './application/application.service';
import {
  CreateApplicationIdeaDto,
  IdeaCardInfoDto,
  IdeaGetConfirmOtpDto,
  IdeaGetLimitDto,
  IdeaMyIdDto,
  IdeaResendOtpDto,
  IdeaVerifyCardDto,
} from './application/dto/application.dto';
import { CreateProductIdeaDto } from './products/dto/product.dto';
import { ProductsService } from './products/products.service';
import { PhonesService } from './phones/phones.service';
import { CreatePhonesIdeaDto } from './phones/dto/phones.dto';
import { AccessTokenGuard } from '../auth/auth.guard';

@ApiBearerAuth()
@ApiTags('Idea')
@UseGuards(AccessTokenGuard)
@Controller('idea')
export class IdeaController {
  constructor(
    public applicationService: ApplicationService,
    public productService: ProductsService,
    public phonesService: PhonesService,
  ) {}

  @ApiOperation({ summary: 'IDEA 1-step client info' })
  @Post('broker/client-info')
  async createApplication(@Body() data: CreateApplicationIdeaDto) {
    return this.applicationService.createApp(data);
  }

  @ApiOperation({ summary: 'IDEA 2-step card info' })
  @Post('broker/card-info')
  async cardInfo(@Body() data: IdeaCardInfoDto) {
    return this.applicationService.updateCardDetails(data);
  }

  @ApiOperation({ summary: 'IDEA Verify card if uzcard second part true' })
  @Post('/broker/confirm-card')
  async checkCard(@Body() data: IdeaVerifyCardDto) {
    return this.applicationService.verifyCard(data);
  }

  @ApiOperation({ summary: 'IDEA confirm card second part' })
  @Post('/broker/confirm-card-2')
  async confirmCard(@Body() data: IdeaVerifyCardDto) {
    return this.applicationService.confirmCard(data);
  }

  @ApiOperation({ summary: 'IDEA get limit' })
  @Post('/broker/get-limit')
  async getLimit(@Body() data: IdeaGetLimitDto) {
    return this.applicationService.getLimit(data);
  }

  @ApiOperation({ summary: 'IDEA add product info' })
  @Post('/broker/product-info')
  async addProduct(@Body() data: CreateProductIdeaDto) {
    return this.productService.createProduct(data);
  }

  @ApiOperation({ summary: 'IDEA add product info' })
  @ApiBody({ type: [CreatePhonesIdeaDto] }) // DTO massivini dokumentatsiyalash
  @Post('/broker/phones')
  async addPhone(@Body() data: CreatePhonesIdeaDto[]) {
    return this.phonesService.addPhone(data);
  }

  @ApiOperation({ summary: 'IDEA send contract otp if new_client tru' })
  @Post('/broker/contract-otp')
  async contractOtp(@Body() data: IdeaGetConfirmOtpDto) {
    return this.applicationService.getConfirmOtp(data);
  }

  @ApiOperation({ summary: 'IDEA verify contract otp if new_client tru' })
  @Post('/broker/confirm-contract-otp')
  async verifyOtp(@Body() data: IdeaVerifyCardDto) {
    return this.applicationService.verifyOtp(data);
  }

  // my-id ni test qilish uchun
  // @ApiOperation({ summary: 'my id or card message' })
  // @Post('/broker/my-id')
  // async myId(@Body() data: IdeaMyIdDto) {
  //   return this.applicationService.verifyMyId(data);
  // }

  @ApiOperation({ summary: 'IDEA get schudele' })
  @Post('/broker/get-contract')
  async schudele(@Body() data: IdeaGetLimitDto, @Res() res: Response) {
    return this.applicationService.getSchedule(data, res);
  }

  @ApiOperation({ summary: 'IDEA resend Otp' })
  @Post('/broker/resend-otp')
  async sendResendOtp(@Body() data: IdeaResendOtpDto) {
    return this.applicationService.resendOtp(data);
  }

  @ApiOperation({ summary: 'IDEA reject' })
  @Post('/broker/reject')
  async rejectApplication(@Body() data: IdeaGetConfirmOtpDto) {
    return this.applicationService.rejectApp(data);
  }

  @ApiOperation({ summary: 'IDEA delete product' })
  @Post('/broker/delete-product')
  async deleteProduct(@Body() data: IdeaGetConfirmOtpDto) {
    return this.applicationService.deleteProductByAppId(data);
  }

  // aplicationsni bazadan olish uchun
  // @ApiQuery({ name: 'id', type: String })
  // @Get('find-one')
  // async findOneApp(@Query('id') id: string) {
  //   return this.applicationService.appGetOne(id);
  // }
}
