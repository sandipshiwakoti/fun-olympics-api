import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { GameService } from 'src/game/game.service';
import { Repository } from 'typeorm';
import { CreateBroadcastDTO, UpdateBroadcastDTO } from './broadcast.dto';
import { BroadcastEntity } from './broadcast.entity';

@Injectable()
export class BroadcastService {
  constructor(
    @InjectRepository(BroadcastEntity)
    private broadcastRepository: Repository<BroadcastEntity>,
    private gameService: GameService,
  ) {}

  async getBroadcasts(
    search: string,
    options: IPaginationOptions,
  ): Promise<Pagination<BroadcastEntity>> {
    const queryBuilder = this.broadcastRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.game', 'game')
      .where('b.title like :search', { search: `%${search}%` })
      .where('b.description like :search', { search: `%${search}%` });

    return paginate<BroadcastEntity>(queryBuilder, {
      ...options,
    });
  }

  // async getBroadcasts(): Promise<BroadcastEntity[]> {
  //   const queryBuilder = this.broadcastRepository
  //     .createQueryBuilder('b')
  //     .leftJoinAndSelect('b.game', 'game')
  //     .leftJoinAndSelect('b.comments', 'comments');

  //   return queryBuilder.getMany();
  // }

  async getBroadcastById(id: number): Promise<BroadcastEntity> {
    const broadcast = await this.broadcastRepository.findOne({
      where: { id },
      relations: ['game', 'comments.author'],
    });
    if (!broadcast) {
      throw new HttpException('Broadcast not found', HttpStatus.NOT_FOUND);
    }
    return broadcast;
  }

  async createBroadcast(broadcastPayload: CreateBroadcastDTO) {
    const game = await this.gameService.getGameById(broadcastPayload.gameId);

    const { title, description, link, scheduledAt } = broadcastPayload;
    const newBroadcast = await this.broadcastRepository.save({
      title,
      description,
      game,
      link,
      scheduledAt,
    });
    return newBroadcast;
  }

  async updateBroadcast(
    id: number,
    broadcastPayload: UpdateBroadcastDTO,
  ): Promise<BroadcastEntity> {
    const broadcast = await this.getBroadcastById(id);

    broadcast.title = broadcastPayload.title;
    broadcast.description = broadcastPayload.description;
    broadcast.link = broadcastPayload.link;
    broadcast.scheduledAt = broadcastPayload.scheduledAt;
    broadcast.game.id = broadcastPayload.gameId;

    const updateBroadcast = await this.broadcastRepository.save(broadcast);
    return updateBroadcast;
  }

  async removeBroadcast(id: number): Promise<BroadcastEntity> {
    const broadcast = await this.getBroadcastById(id);
    const deletedBroadcast = await this.broadcastRepository.remove(broadcast);
    return deletedBroadcast;
  }
}
