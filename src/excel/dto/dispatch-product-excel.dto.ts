import { IsDate, IsNumber, IsString } from 'class-validator';

export class DispatchProductExcelDto {
  @IsString()
  batch_num: string;

  @IsDate()
  date: Date;

  @IsString()
  responsible: string;

  @IsString()
  observations: string;

  @IsNumber()
  quantity: number;

  @IsString()
  num_domain: string;

  @IsString()
  vehicle: string;

  @IsString()
  packaging: string;
}
