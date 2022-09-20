import { NewsEntity } from 'src/news/news.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('news_comment')
export class NewsCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ type: 'datetime', default: null, nullable: true })
  commentedAt: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.newsComments, {
    onDelete: 'CASCADE',
  })
  author: UserEntity;

  @ManyToOne(() => NewsEntity, (news) => news.comments, {
    onDelete: 'CASCADE',
  })
  news: NewsEntity;
}
