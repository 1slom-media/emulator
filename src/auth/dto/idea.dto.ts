import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IdeaAuthDto {
  @ApiProperty({ example: 'idea-admin' })
  @IsString()
  login: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  password: string;
}

export class IdeaRegisterDto {
  @ApiProperty({ example: 'idea-admin' })
  @IsString()
  login: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  password: string;

  @ApiProperty({ example: '51363748-ee49-4b72-be4c-eb797db51ffc' })
  @IsString()
  broker_key: string;

  @ApiProperty({ example: '129' })
  @IsString()
  model_id: string;
}
