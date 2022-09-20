import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BroadcastModule } from 'src/broadcast/broadcast.module';
import { UserModule } from 'src/user/user.module';
import { BroadcastCommentController } from './broadcast_comment.controller';
import { BroadcastCommentEntity } from './broadcast_comment.entity';
import { BroadcastCommentService } from './broadcast_comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BroadcastCommentEntity]),
    UserModule,
    BroadcastModule,
  ],
  controllers: [BroadcastCommentController],
  providers: [BroadcastCommentService],
})
export class CommentModule {}
