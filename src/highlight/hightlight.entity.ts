import { BroadcastEntity } from 'src/broadcast/broadcast.entity';
import { HighlightCommentEntity } from 'src/highlight_comment/highlight_comment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('highlight')
export class HighlightEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  link: string;

  @ManyToOne(() => BroadcastEntity, (broadcast) => broadcast.highlights, {
    onDelete: 'CASCADE',
  })
  broadcast: BroadcastEntity;

  @OneToMany(() => HighlightCommentEntity, (comment) => comment.highlight)
  comments: HighlightCommentEntity[];
}
