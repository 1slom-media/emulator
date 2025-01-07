import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhonesIdeaEntity } from './entities/phones.entity';
import { CreatePhonesIdeaDto } from './dto/phones.dto';

@Injectable()
export class PhonesService {
  constructor(
    @InjectRepository(PhonesIdeaEntity, 'main')
    private readonly phonesRepo: Repository<PhonesIdeaEntity>,
  ) {}

  async addPhone(data: CreatePhonesIdeaDto) {
    const phones = this.phonesRepo.save(data);
    if (phones) {
      return {
        success: true,
      };
    }
  }
}
