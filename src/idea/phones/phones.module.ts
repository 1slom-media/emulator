import { Module } from '@nestjs/common';
import { PhonesService } from './phones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhonesIdeaEntity } from './entities/phones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PhonesIdeaEntity], 'main')],
  providers: [PhonesService],
  exports: [PhonesService],
})
export class PhonesModule {}
