import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAddressDto {
  @IsString()
  @IsOptional()
  street?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  provinceId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  cityId?: number;
}
