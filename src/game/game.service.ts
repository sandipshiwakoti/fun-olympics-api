import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { GameEntity } from './entity/game.entity';
import { CreateGameDTO, UpdateGameDTO } from './game.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private gameRepository: Repository<GameEntity>,
  ) {}

  // public async getGames(): Promise<GameEntity[]> {
  //   const games = await this.gameRepository.find();
  //   if (!games || !games[0]) {
  //     throw new HttpException('Games not found', 404);
  //   }
  //   return games;
  // }

  async getGames(
    search: string,
    options: IPaginationOptions,
  ): Promise<Pagination<GameEntity>> {
    const queryBuilder = this.gameRepository
      .createQueryBuilder('n')
      .where('n.title like :search', { search: `%${search}%` })
      .where('n.description like :search', { search: `%${search}%` });

    return paginate<GameEntity>(queryBuilder, options);
  }

  async getGameById(id: number): Promise<GameEntity> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: { broadcasts: true },
    });
    if (!game) {
      throw new HttpException('Game not found', 404);
    }
    return game;
  }

  async createGame(
    game: CreateGameDTO,
    file: Express.Multer.File,
  ): Promise<GameEntity> {
    const newGame = await this.gameRepository.save({
      ...game,
      img: file ? file.path : null,
    });
    return newGame;
  }

  async updateGame(
    id: number,
    gamePayload: UpdateGameDTO,
    file: Express.Multer.File,
  ): Promise<GameEntity> {
    const game = await this.getGameById(id);
    game.title = gamePayload.title;

    if (gamePayload.description) {
      game.description = gamePayload.description;
    }

    if (file) {
      game.img = file.path;
    }

    const updatedGame = await this.gameRepository.save(game);
    return updatedGame;
  }

  async removeGame(id: number): Promise<GameEntity> {
    const game = await this.getGameById(id);
    const deletedGame = await this.gameRepository.remove(game);
    return deletedGame;
  }
}
