import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationIdeaEntity } from './entities/application.entity';
import { ApiClientModule } from '../../api-client/api-client.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([], 'secondary'),
    TypeOrmModule.forFeature([ApplicationIdeaEntity], 'main'),
    ApiClientModule,
    HttpModule,
  ],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
