import { IsNumber, IsString } from 'class-validator';
import { IsExactDigitLength } from 'src/common/decorators/is_exact_digit_length.decorator';

export class LoginUserDto {
  @IsNumber()
  @IsExactDigitLength(8)
  dni: number;

  @IsString()
  password: string;
}
