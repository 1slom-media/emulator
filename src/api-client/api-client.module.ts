// api-client.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)], // forwardRef() ishlatish
  providers: [ApiClientService],
  exports: [ApiClientService],
})
export class ApiClientModule {}
