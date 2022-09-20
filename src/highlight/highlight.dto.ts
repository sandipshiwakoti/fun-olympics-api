import { IsNotEmpty, IsNumber, IsUrl } from 'class-validator';

export class CreateHighlightDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsNumber()
  @IsNotEmpty()
  broadcastId: number;
}

export class UpdateHighlightDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsNumber()
  @IsNotEmpty()
  broadcastId: number;
}
