import { HighlightEntity } from 'src/highlight/hightlight.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('highlight_comment')
export class HighlightCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ type: 'datetime', default: null, nullable: true })
  commentedAt: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.hightlightComments, {
    onDelete: 'CASCADE',
  })
  author: UserEntity;

  @ManyToOne(() => HighlightEntity, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  highlight: HighlightEntity;
}
