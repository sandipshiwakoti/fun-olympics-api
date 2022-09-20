import { BroadcastEntity } from 'src/broadcast/broadcast.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('broadcast_comment')
export class BroadcastCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ type: 'datetime', default: null, nullable: true })
  commentedAt: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.broadcastComments, {
    onDelete: 'CASCADE',
  })
  author: UserEntity;

  @ManyToOne(() => BroadcastEntity, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  broadcast: BroadcastEntity;
}
