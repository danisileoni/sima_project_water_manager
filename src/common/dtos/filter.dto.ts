import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;

  @IsOptional()
  @Type(() => String)
  search?: string;
}
