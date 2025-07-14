import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCityDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  postal_code?: string;

  @IsNumber()
  @Type(() => Number)
  provinceId: number;
}
