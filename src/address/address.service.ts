import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address } from './entities/address.entity';
import { Province } from './entities/province.entity';
import { City } from './entities/city.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const { street, provinceId, cityId } = createAddressDto;

    // Create a new address entity
    const address = new Address();
    address.street = street;

    // Find and set the province if provinceId is provided
    if (provinceId) {
      const province = await this.provinceRepository.findOneBy({
        id: provinceId,
      });
      if (!province) {
        throw new NotFoundException(`Province with ID ${provinceId} not found`);
      }
      address.province = province;
    }

    // Find and set the city if cityId is provided
    if (cityId) {
      const city = await this.cityRepository.findOneBy({ id: cityId });
      if (!city) {
        throw new NotFoundException(`City with ID ${cityId} not found`);
      }
      address.city = city;
    }

    return await this.addressRepository.save(address);
  }

  async findAll(): Promise<Address[]> {
    return await this.addressRepository.find({
      relations: ['province', 'city'],
    });
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['province', 'city'],
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return address;
  }

  async remove(id: number): Promise<void> {
    const address = await this.findOne(id);
    await this.addressRepository.softRemove(address);
  }
}
