import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { City } from './entities/city.entity';
import { Province } from './entities/province.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    const { name, postal_code, provinceId } = createCityDto;

    // Find the province
    const province = await this.provinceRepository.findOneBy({
      id: provinceId,
    });
    if (!province) {
      throw new NotFoundException(`Province with ID ${provinceId} not found`);
    }

    // Create and save the city
    const city = new City();
    city.name = name;
    city.postal_code = postal_code;
    city.province = province;

    return await this.cityRepository.save(city);
  }

  async findAll(): Promise<City[]> {
    return await this.cityRepository.find({
      relations: ['province'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<City> {
    const city = await this.cityRepository.findOne({
      where: { id },
      relations: ['province'],
    });

    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }

    return city;
  }

  async remove(id: number): Promise<void> {
    const city = await this.findOne(id);
    await this.cityRepository.softRemove(city);
  }
}
