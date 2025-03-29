import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class ControlProductDto {
  @IsString()
  date: string;

  @IsString()
  @MaxLength(8)
  @MinLength(8)
  batch_num: string;

  @IsString()
  responsible: string;

  @IsString()
  observations: string;

  @IsNumber()
  quantity_enter: number;

  @IsNumber()
  quantity_out: number;
}
