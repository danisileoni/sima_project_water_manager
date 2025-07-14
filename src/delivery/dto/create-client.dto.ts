import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '../../address/dto/create-address.dto';

export class ProductDto {
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  product_id: number;

  @IsString()
  @MaxLength(8)
  @MinLength(8)
  batch_of_product: string;
}

export class CreateClientDto {
  @IsString()
  @MaxLength(255)
  name_or_company: string;

  @IsString()
  @MaxLength(255)
  contact: string;

  @IsString()
  @MaxLength(255)
  observations: string;

  @IsString()
  dni_cuit: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;
}
