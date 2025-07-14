import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { Address } from './entities/address.entity';
import { Province } from './entities/province.entity';
import { City } from './entities/city.entity';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';
import { CityService } from './city.service';
import { CityController } from './city.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Province, City])],
  controllers: [AddressController, ProvinceController, CityController],
  providers: [AddressService, ProvinceService, CityService],
  exports: [AddressService, ProvinceService, CityService],
})
export class AddressModule {}
