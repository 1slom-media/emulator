import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

// create
export class CreateProductIdeaDto {
    @ApiProperty({ description: 'Application ID' })
    @IsString()
    app_id: string;
  
    @IsString()
    @IsOptional()
    application_id: string;

    @IsString()
    @IsOptional()
    product_id: string;
  
    @ApiProperty({ description: 'Month' })
    @IsString()
    month: string;
  
    @ApiProperty({
      description: 'Products array',
      isArray: true,
      type: () => ProductDto,
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    products: ProductDto[];
  }
  
  export class ProductDto {
    @ApiProperty({ description: 'Good name' })
    @IsString()
    good_name: string;
  
    @ApiProperty({ description: 'Good type name' })
    @IsString()
    good_type_name: string;
  
    @ApiProperty({ description: 'IKPU' })
    @IsOptional()
    @IsString()
    ikpu: string | null;
  
    @ApiProperty({ description: 'Price' })
    @IsString()
    price: string;
  
    @ApiProperty({ description: 'Marking' })
    @IsOptional()
    @IsString()
    marking: string | null;
  }
  
