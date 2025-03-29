import {
  IsEmail,
  IsLowercase,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsExactDigitLength } from 'src/common/decorators/is_exact_digit_length.decorator';

export class CreateUserDto {
  @IsString()
  @MaxLength(21)
  name: string;

  @IsString()
  @MaxLength(21)
  surname: string;

  @IsNumber()
  @IsExactDigitLength(8)
  dni: number;

  @IsEmail()
  @IsString()
  @IsLowercase()
  email: string;

  @IsString()
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  @MinLength(8)
  @MaxLength(21)
  password: string;

  @IsString({ each: true })
  role: string[];

  @IsString()
  confirmPassword: string;
}
