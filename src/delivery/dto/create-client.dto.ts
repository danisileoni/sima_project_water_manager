import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @MaxLength(255)
  name_or_company: string;

  @IsString()
  @MaxLength(255)
  contact: string;

  @IsNumber()
  quantity: number;

  @IsString()
  @MaxLength(255)
  observations: string;

  @IsString()
  dni_cuit: string;

  @IsString()
  @MaxLength(8)
  @MinLength(8)
  batch_of_product: string;
}
