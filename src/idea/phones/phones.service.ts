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

  async addPhone(data: CreatePhonesIdeaDto[]) {
    // Typing corrected here
    const savedPhones = [];
    for (const element of data) {
      const phone = await this.phonesRepo.save(element); // Saqlashni kutamiz
      savedPhones.push(phone);
    }

    if (savedPhones.length > 0) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
  }
}
