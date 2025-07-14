import { IsOptional, IsString } from 'class-validator';

export class CreateProvinceDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  country?: string;
}
