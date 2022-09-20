import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Role } from 'src/role.enum';

export class CreateUserDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsMobilePhone()
  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role.Admin | Role.User;

  @IsNotEmpty()
  country: string;
}

export class UpdateUserDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsMobilePhone()
  @IsNotEmpty()
  mobile: string;

  @IsOptional()
  img: string;

  @IsNotEmpty()
  country: string;
}

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsUrl()
  email: string;

  @IsNotEmpty()
  password: string;
}
