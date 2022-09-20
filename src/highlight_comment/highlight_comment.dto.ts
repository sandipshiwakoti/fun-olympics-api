import { IsNotEmpty } from 'class-validator';

export class CreateHighlightCommentDTO {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  highlightId: number;
}

export class UpdateHighlightCommentDTO {
  @IsNotEmpty()
  content: string;
}
