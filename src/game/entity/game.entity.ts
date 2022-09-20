import { BroadcastEntity } from 'src/broadcast/broadcast.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('game')
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  img: string;

  @OneToMany(() => BroadcastEntity, (broadcast) => broadcast.game)
  broadcasts: BroadcastEntity[] | null;
}
