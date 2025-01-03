// auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiClientModule } from '../api-client/api-client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaAuthEntity } from './entities/idea.entity';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([IdeaAuthEntity], 'main'),
    forwardRef(() => ApiClientModule), // forwardRef() ishlatish
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
