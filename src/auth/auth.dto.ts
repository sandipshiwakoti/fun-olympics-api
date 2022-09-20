import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from 'src/user/entity/user.entity';

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginResponseDTO extends UserEntity {
  accessToken?: string;
}

export class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEmail()
  password: string;
}

export class RequestRegistrationDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  // @IsMobilePhone()
  mobile: string;
}

export class VerifyRegistrationDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  registerToken: string;
}

export class RegistrationDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  registerToken: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class JWTPayloadDTO {
  name: string;
  email: string;
  role: string;
  registeredAt: Date;
}
