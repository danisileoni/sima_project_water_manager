import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { FilterDto } from 'src/common/dtos/filter.dto';

export class FilterUserDto extends PartialType(FilterDto) {
  @IsOptional()
  @IsString()
  search: string;
}
