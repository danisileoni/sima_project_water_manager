import {
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDispatchDto {
  @IsString()
  date: string;

  @IsNumber()
  type_packaging_id: number;

  @IsString()
  @MaxLength(8)
  @MinLength(8)
  batch_num: string;

  @IsNumber()
  quantity: number;

  @IsString()
  num_domain: string;

  @IsString()
  responsible: string;

  @IsString()
  observations: string;

  @IsString()
  vehicle: string;

  @IsString()
  @IsUUID()
  user_dispatch_id: string;
}
