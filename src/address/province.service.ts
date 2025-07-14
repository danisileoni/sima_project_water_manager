import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProvinceDto } from './dto/create-province.dto';
import { Province } from './entities/province.entity';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  async create(createProvinceDto: CreateProvinceDto): Promise<Province> {
    const province = this.provinceRepository.create(createProvinceDto);
    return await this.provinceRepository.save(province);
  }

  async findAll(): Promise<Province[]> {
    return await this.provinceRepository.find({
      relations: ['cities'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Province> {
    const province = await this.provinceRepository.findOne({
      where: { id },
      relations: ['cities'],
    });

    if (!province) {
      throw new NotFoundException(`Province with ID ${id} not found`);
    }

    return province;
  }

  async remove(id: number): Promise<void> {
    const province = await this.findOne(id);
    await this.provinceRepository.softRemove(province);
  }
}
