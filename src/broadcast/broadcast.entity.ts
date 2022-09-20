import {} from 'class-validator';
import { BroadcastCommentEntity } from 'src/broadcast_comment/broadcast_comment.entity';
import { GameEntity } from 'src/game/entity/game.entity';
import { HighlightEntity } from 'src/highlight/hightlight.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('broadcast')
export class BroadcastEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  link: string;

  @Column({ type: 'datetime' })
  scheduledAt: Date;

  @ManyToOne(() => GameEntity, (game) => game.broadcasts, {
    onDelete: 'CASCADE',
  })
  game: GameEntity;

  @OneToMany(() => BroadcastCommentEntity, (comment) => comment.broadcast)
  comments: BroadcastCommentEntity[];

  @OneToMany(() => HighlightEntity, (hightlight) => hightlight.broadcast)
  highlights: HighlightEntity[];
}
