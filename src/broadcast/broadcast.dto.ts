import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateBroadcastDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsNotEmpty()
  scheduledAt: Date;

  @IsNumber()
  @IsNotEmpty()
  gameId: number;
}

export class UpdateBroadcastDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  scheduledAt: Date;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsNumber()
  @IsNotEmpty()
  gameId: number;
}
