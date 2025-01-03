import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IdeaAuthDto, IdeaRegisterDto } from './dto/idea.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(public authService: AuthService) {}

  @ApiOperation({ summary: 'Broker login parol yaratish' })
  @Post('idea-register')
  async registerIdea(@Body() data: IdeaRegisterDto) {
    return this.authService.registerIdea(data);
  }

  @ApiOperation({ summary: 'Broker login qilish' })
  @Post('idea/broker/login')
  async loginIdea(@Body() data: IdeaAuthDto) {
    return this.authService.loginIdea(data);
  }
}
