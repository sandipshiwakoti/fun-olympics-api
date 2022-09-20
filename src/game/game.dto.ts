import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateGameDTO {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;
}

export class UpdateGameDTO {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;
}
