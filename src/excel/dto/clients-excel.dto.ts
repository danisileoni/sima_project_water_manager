import { IsString } from 'class-validator';

export class ClientExcelDto {
  @IsString()
  name_or_company_name: string;

  @IsString()
  dni_cuit: string;

  @IsString()
  batch_of_product: string;

  @IsString()
  date: string;

  @IsString()
  contact: string;

  @IsString()
  observations: string;
}
