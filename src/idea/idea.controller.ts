import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApplicationService } from './application/application.service';
import {
  CreateApplicationIdeaDto,
  IdeaCardInfoDto,
} from './application/dto/application.dto';

@ApiTags('Idea')
@Controller('idea')
export class IdeaController {
  constructor(public applicationService: ApplicationService) {}

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
}
