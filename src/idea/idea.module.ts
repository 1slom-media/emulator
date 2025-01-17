import { Module } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaController } from './idea.controller';
import { ApplicationModule } from './application/application.module';
import { ApplicationService } from './application/application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationIdeaEntity } from './application/entities/application.entity';
import { ApiClientModule } from '../api-client/api-client.module';
import { ProductsModule } from './products/products.module';
import { PhonesModule } from './phones/phones.module';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [IdeaService, ApplicationService],
  controllers: [IdeaController],
  imports: [
    TypeOrmModule.forFeature([], 'secondary'),
    TypeOrmModule.forFeature([ApplicationIdeaEntity], 'main'),
    ApplicationModule,
    ApiClientModule,
    ProductsModule,
    PhonesModule,
    HttpModule,
    AuthModule
  ],
})
export class IdeaModule {}
                                          