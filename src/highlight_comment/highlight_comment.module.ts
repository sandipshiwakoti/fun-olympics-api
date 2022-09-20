import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HighlightModule } from 'src/highlight/highlight.module';
import { UserModule } from 'src/user/user.module';
import { HighlightCommentController } from './highlight_comment.controller';
import { HighlightCommentEntity } from './highlight_comment.entity';
import { HighlightCommentService } from './hightlight_comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HighlightCommentEntity]),
    UserModule,
    HighlightModule,
  ],
  controllers: [HighlightCommentController],
  providers: [HighlightCommentService],
})
export class HighlightCommentModule {}
