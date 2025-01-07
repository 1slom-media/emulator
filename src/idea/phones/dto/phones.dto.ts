import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePhonesIdeaDto {
  @ApiProperty({ description: 'Application ID' })
  @IsString()
  app_id: string;

  @ApiProperty({ description: 'Body of the phone idea' })
  @IsString()
  body: string;

  @ApiProperty({ description: 'Name of the phone idea' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Relation name of the entity' })
  @IsString()
  relation_name: string;

  @ApiProperty({ description: 'Relation ID of the entity' })
  @IsString()
  relation_id: string;
}
