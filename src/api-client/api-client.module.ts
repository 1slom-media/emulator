// api-client.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiLogEntity } from './entities/api-client';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([ApiLogEntity], 'main'),
  ], // forwardRef() ishlatish
  providers: [ApiClientService],
  exports: [ApiClientService],
})
export class ApiClientModule {}
