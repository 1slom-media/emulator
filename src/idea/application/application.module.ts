import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationIdeaEntity } from './entities/application.entity';
import { ApiClientModule } from '../../api-client/api-client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationIdeaEntity], 'main'),
  ApiClientModule
  ],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
