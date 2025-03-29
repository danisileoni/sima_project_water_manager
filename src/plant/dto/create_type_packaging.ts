import { IsNumber, IsString } from 'class-validator';

export class CreateTypePackagingDto {
  @IsString()
  packaging: string;

  @IsNumber()
  liters: number;

  @IsNumber()
  milliliters: number;
}
