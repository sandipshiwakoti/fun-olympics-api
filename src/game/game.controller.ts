import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import TransformInterceptor from '../interceptors/transform.interceptor';
import { GameEntity } from './entity/game.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multer-options';
import { CreateGameDTO, UpdateGameDTO } from './game.dto';
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/role.enum';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Public } from 'src/auth/auth.decorator';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  // @UseInterceptors(TransformInterceptor('Games found!'))
  // @Public()
  // @Get()
  // getGames(): Promise<GameEntity[]> {
  //   return this.gameService.getGames();
  // }

  @UseInterceptors(TransformInterceptor('Games found!'))
  @Get()
  @Public()
  getGames(
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<GameEntity>> {
    return this.gameService.getGames(search, { page, limit });
  }

  @UseInterceptors(TransformInterceptor('Game found!'))
  @Get(':id')
  getGameById(@Param('id', ParseIntPipe) id: number): Promise<GameEntity> {
    return this.gameService.getGameById(id);
  }

  @Roles(Role.Admin)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', multerOptions),
    TransformInterceptor('Successfully created game!'),
  )
  createGame(
    @Body() game: CreateGameDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<GameEntity> {
    return this.gameService.createGame(game, file);
  }

  @Roles(Role.Admin)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', multerOptions),
    TransformInterceptor('Successfully updated game!'),
  )
  updateGame(
    @Param('id', ParseIntPipe) id: number,
    @Body() game: UpdateGameDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<GameEntity> {
    return this.gameService.updateGame(id, game, file);
  }

  @Roles(Role.Admin)
  @UseInterceptors(TransformInterceptor('Successfully deleted game!'))
  @Delete(':id')
  removeGame(@Param('id', ParseIntPipe) id: number): Promise<GameEntity> {
    return this.gameService.removeGame(id);
  }
}
