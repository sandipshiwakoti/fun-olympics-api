import { IsNotEmpty } from 'class-validator';

export class CreateNewsCommentDTO {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  newsId: number;
}

export class UpdateNewsCommentDTO {
  @IsNotEmpty()
  content: string;
}
