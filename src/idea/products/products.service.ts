import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiClientService } from 'src/api-client/api-client.service';
import { Repository } from 'typeorm';
import { ProductIdeaEntity } from './entities/product.entity';
import { CreateProductIdeaDto } from './dto/product.dto';
import { ApplicationService } from '../application/application.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductIdeaEntity, 'main')
    private readonly productRepo: Repository<ProductIdeaEntity>,
    private readonly apiService: ApiClientService,
    private readonly applicationRepo: ApplicationService,
  ) {}

  async createProduct(data: CreateProductIdeaDto) {
    try {
      const app = await this.applicationRepo.getOneId(data.app_id);
      console.log(app,"app");
      
      if (!app) {
        return {
          success: false,
          message: 'Application not found',
        };
      }

      await this.applicationRepo.savePeriod(data.app_id, data.month);

      for (const product of data.products) {
        const body = {
          name: product.good_name,
          amount: product.price,
          count: 1,
          application: app.application_id,
        };

        const response = await this.apiService.postApiWithToken(
          '/products',
          'IDEA',
          body,
        );
        console.log(response,"products");
        if (response.statusCode === true && response.result) {
          const productEntity = new ProductIdeaEntity();
          productEntity.application_id = response.result.application.toString();
          productEntity.product_id = response.result.id.toString();
          productEntity.name = response.result.name;
          productEntity.amount = response.result.amount.toString();
          productEntity.good_type_name = product.good_type_name;
          productEntity.ikpu = product.ikpu || '';
          productEntity.month = data.month;
          await this.productRepo.save(productEntity);
        }
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
