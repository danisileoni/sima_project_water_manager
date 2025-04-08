import { IsNumber, IsString } from 'class-validator';

export class ControlProductExcelDto {
  @IsString()
  batch_num: string;

  @IsString()
  responsible: string;

  @IsString()
  production_date: string;

  @IsString()
  observations: string;

  @IsNumber()
  quantity_enter: number;

  @IsNumber()
  quantity_out: number;
}
