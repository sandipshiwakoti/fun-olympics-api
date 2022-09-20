import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from 'src/game/game.module';
import { BroadcastController } from './broadcast.controller';
import { BroadcastEntity } from './broadcast.entity';
import { BroadcastService } from './broadcast.service';

@Module({
  imports: [TypeOrmModule.forFeature([BroadcastEntity]), GameModule],
  controllers: [BroadcastController],
  providers: [BroadcastService],
  exports: [BroadcastService],
})
export class BroadcastModule {}
