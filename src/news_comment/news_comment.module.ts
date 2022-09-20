import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsModule } from 'src/news/news.module';
import { UserModule } from 'src/user/user.module';
import { NewsCommentController } from './news_comment.controller';
import { NewsCommentEntity } from './news_comment.entity';
import { NewsCommentService } from './news_comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsCommentEntity]),
    UserModule,
    NewsModule,
  ],
  controllers: [NewsCommentController],
  providers: [NewsCommentService],
})
export class NewsCommentModule {}
