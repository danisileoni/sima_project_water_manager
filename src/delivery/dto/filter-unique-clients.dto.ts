import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min, IsString } from 'class-validator';

export class FilterUniqueClientsDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;

  @IsOptional()
  @IsString()
  @Type(() => String)
  search?: string;
}
