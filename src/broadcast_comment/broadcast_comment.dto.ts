import { IsNotEmpty } from 'class-validator';

export class CreateBroadcastCommentDTO {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  broadcastId: number;
}

export class UpdateBroadcastCommentDTO {
  @IsNotEmpty()
  content: string;
}
