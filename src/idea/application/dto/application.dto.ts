import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

// create
export class CreateApplicationIdeaDto {
  @ApiProperty({
    description: 'Phone number of the user',
    example: '998901536621',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Additional phone number of the user',
    example: '99820053001',
  })
  @IsNotEmpty()
  @IsString()
  additional_phone: string;

  @ApiProperty({ description: 'Photo URL' })
  @IsNotEmpty()
  @IsString()
  photo: string;

  @ApiProperty({
    description: 'PINFL (Personal Identification Number)',
    required: false,
  })
  @IsOptional()
  @IsString()
  pinfl?: string;

  @ApiProperty({ description: 'First name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Last name of the user' })
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiProperty({ description: 'Patronymic of the user' })
  @IsNotEmpty()
  @IsString()
  patronymic: string;

  @ApiProperty({ description: 'Birth date of the user' })
  @IsNotEmpty()
  birth_date: string;

  @ApiProperty({ description: 'Passport series' })
  @IsNotEmpty()
  @IsString()
  passport_series: string;

  @ApiProperty({ description: 'Passport number' })
  @IsNotEmpty()
  @IsString()
  passport_number: string;

  @ApiProperty({ description: 'Passport issued by' })
  @IsNotEmpty()
  @IsString()
  passport_given: string;

  @ApiProperty({ description: 'Passport issue date' })
  @IsNotEmpty()
  passport_issue_date: string;

  @ApiProperty({ description: 'Passport expiry date' })
  @IsNotEmpty()
  passport_expiry_date: string;

  @ApiProperty({ description: 'Accept agreement URL' })
  @IsNotEmpty()
  @IsString()
  accept_agreement_url: string;

  @ApiProperty({ description: 'Accept agreement date' })
  @IsNotEmpty()
  accept_agreement_date: string;
}

// Card Info
export class IdeaCardInfoDto {
  @ApiProperty({ description: 'Application ID' })
  @IsString()
  app_id: string;

  @ApiProperty({ description: 'Card number', example: '9860190101248614' })
  @IsString()
  card_number: string;

  @ApiProperty({ description: 'Card expiry date', example: '1029' })
  @IsString()
  expire: string;
}

// myId dto
export class IdeaMyIdDto {
  @ApiProperty({ description: 'Application ID' })
  @IsString()
  application_id: string;

  @ApiProperty({ description: 'Card number', example: '2005-30-01' })
  @IsString()
  birth_date: string;

  @ApiProperty({ description: 'Card expiry date', example: 'AD0708282' })
  @IsString()
  pass_data: string;

  @ApiProperty({
    description: 'Card expiry date',
    example:
      '/storage/uploads/6/6/pGCnKebH8FEKuwf9dnd7C6sMCFqfTzrO4G9Uybry.jpg',
  })
  @IsString()
  photo: string;
}

// myId dto
export class IdeaVerifyCardDto {
  @ApiProperty({ description: 'Application ID' })
  @IsString()
  app_id: string;

  @ApiProperty({ description: 'Otp', example: '777777' })
  @IsString()
  otp: string;
}

// get limit
export class IdeaGetLimitDto {
  @ApiProperty({ description: 'Application ID' })
  @IsString()
  app_id: string;
}

// get limit
export class IdeaGetConfirmOtpDto {
  @ApiProperty({ description: 'Application ID' })
  @IsString()
  app_id: string;
}

// update
export class UpdateApplicationIdeaDto extends CreateApplicationIdeaDto {
  @ApiProperty({ description: 'Card number', required: false })
  @IsOptional()
  @IsString()
  card_number?: string;

  @ApiProperty({ description: 'Card expiry date', required: false })
  @IsOptional()
  @IsString()
  expire?: string;

  @ApiProperty({ description: 'Schedule file', required: false })
  @IsOptional()
  @IsString()
  schedule_file?: string;

  @ApiProperty({ description: 'Application ID', required: false })
  @IsOptional()
  @IsString()
  application_id?: string;
  
  @ApiProperty({ description: 'Preiod', required: false })
  @IsOptional()
  @IsString()
  period: string;

  @ApiProperty({ description: 'ID of the application', readOnly: true })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'Creation timestamp', readOnly: true })
  @IsNotEmpty()
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ description: 'Update timestamp', readOnly: true })
  @IsNotEmpty()
  @IsDateString()
  updateAt: Date;
}
