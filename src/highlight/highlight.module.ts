import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BroadcastModule } from 'src/broadcast/broadcast.module';
import { HighlightController } from './highlight.controller';
import { HighlightService } from './highlight.service';
import { HighlightEntity } from './hightlight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HighlightEntity]), BroadcastModule],
  controllers: [HighlightController],
  providers: [HighlightService],
  exports: [HighlightService],
})
export class HighlightModule {}
