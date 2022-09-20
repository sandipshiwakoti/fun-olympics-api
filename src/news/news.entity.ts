import { NewsCommentEntity } from 'src/news_comment/news_comment.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('news')
export class NewsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  content: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  img: string;

  @Column()
  publishedAt: string;

  @OneToMany(() => NewsCommentEntity, (comment) => comment.news)
  comments: NewsCommentEntity[];
}
