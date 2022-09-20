import { IsNotEmpty } from 'class-validator';

export class CreateNewsDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  publishedAt: string;
}

export class UpdateNewsDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  publishedAt: string;
}
