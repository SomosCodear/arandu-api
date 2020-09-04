import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CFPEntity } from './cfp.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CFP {
  constructor(
    @InjectRepository(CFPEntity) private cfpRepository: Repository<CFPEntity>,
  ) {}
  getBySlug(slug: string): Promise<CFPEntity> {
    return this.cfpRepository.findOne({
      where: { slug },
      relations: ['fields', 'fields.options'],
    });
  }
}
