import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BroadcastCommentEntity } from 'src/broadcast_comment/broadcast_comment.entity';
import { Exclude } from 'class-transformer';
import { NewsCommentEntity } from 'src/news_comment/news_comment.entity';
import { HighlightCommentEntity } from 'src/highlight_comment/highlight_comment.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  mobile: string;

  @Column()
  @Column({ nullable: true, default: null })
  country: string;

  @Exclude()
  @Column({ default: null })
  password: string;

  @Column({ nullable: true })
  img: string;

  @Column()
  role: string;

  @Exclude()
  @Column({ default: null, nullable: true })
  registerToken: string;

  @Column({ type: 'datetime', default: null, nullable: true })
  registeredAt: Date | null;

  @OneToMany(() => BroadcastCommentEntity, (comment) => comment.author)
  broadcastComments: BroadcastCommentEntity[];

  @OneToMany(() => NewsCommentEntity, (comment) => comment.author)
  newsComments: NewsCommentEntity[];

  @OneToMany(() => HighlightCommentEntity, (comment) => comment.author)
  hightlightComments: HighlightCommentEntity[];
}
