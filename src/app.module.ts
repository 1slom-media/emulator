import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdeaModule } from './idea/idea.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaAuthEntity } from './auth/entities/idea.entity';
import { ApiClientModule } from './api-client/api-client.module';
import { ApplicationIdeaEntity } from './idea/application/entities/application.entity';
import { ProductIdeaEntity } from './idea/products/entities/product.entity';
import { PhonesIdeaEntity } from './idea/phones/entities/phones.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // main db connection
    TypeOrmModule.forRoot({
      name: 'main',
      type: 'postgres',
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      entities: [IdeaAuthEntity, ApplicationIdeaEntity, ProductIdeaEntity,PhonesIdeaEntity],
      synchronize: true,
    }),
    // nasiya db connection
    TypeOrmModule.forRoot({
      name: 'secondary',
      type: 'postgres',
      host: process.env.SECONDARY_PG_HOST,
      port: parseInt(process.env.SECONDARY_PG_PORT),
      username: process.env.SECONDARY_PG_USER,
      password: process.env.SECONDARY_PG_PASSWORD,
      database: process.env.SECONDARY_PG_DATABASE,
      entities: [],
      synchronize: true,
    }),
    IdeaModule,
    AuthModule,
    ApiClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
