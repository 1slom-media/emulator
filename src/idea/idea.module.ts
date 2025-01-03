import { Module } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaController } from './idea.controller';
import { ApplicationModule } from './application/application.module';
import { ApplicationService } from './application/application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationIdeaEntity } from './application/entities/application.entity';
import { ApiClientModule } from '../api-client/api-client.module';

@Module({
  providers: [IdeaService, ApplicationService],
  controllers: [IdeaController],
  imports: [
    TypeOrmModule.forFeature([ApplicationIdeaEntity], 'main'),
    ApplicationModule,
    ApiClientModule
  ],
})
export class IdeaModule {}
                                          