import { IsDate, IsNumber, IsString } from 'class-validator';

export class ControlProductExcelDto {
  @IsString()
  batch_num: string;

  @IsString()
  dni_cuit: string;

  @IsString()
  responsible: string;

  @IsDate()
  production_date: Date;

  @IsString()
  observations: string;

  @IsNumber()
  quantity_enter: number;

  @IsNumber()
  quantity_out: number;
}
