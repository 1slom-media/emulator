import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductIdeaEntity } from './entities/product.entity';
import { ApiClientModule } from '../../api-client/api-client.module';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductIdeaEntity], 'main'),
    ApiClientModule,
    ApplicationModule
  ],
  providers: [ProductsService],
  exports:[ProductsService]
})
export class ProductsModule {}
