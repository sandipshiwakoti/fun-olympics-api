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
import TransformInterceptor from '../interceptors/transform.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multer-options';
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/role.enum';
import { NewsService } from './news.service';
import { NewsEntity } from './news.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateNewsDTO, UpdateNewsDTO } from './news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @UseInterceptors(TransformInterceptor('News articles found!'))
  @Get('')
  getNews(
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<NewsEntity>> {
    return this.newsService.getNews(search, { page, limit });
  }

  @UseInterceptors(TransformInterceptor('News article found!'))
  @Get(':id')
  getNewsById(@Param('id', ParseIntPipe) id: number): Promise<NewsEntity> {
    return this.newsService.getNewsById(id);
  }

  @Roles(Role.Admin)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', multerOptions),
    TransformInterceptor('Successfully created news article!'),
  )
  createNews(
    @Body() game: CreateNewsDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<NewsEntity> {
    return this.newsService.createNews(game, file);
  }

  @Roles(Role.Admin)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', multerOptions),
    TransformInterceptor('Successfully updated news article!'),
  )
  updateNews(
    @Param('id', ParseIntPipe) id: number,
    @Body() game: UpdateNewsDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<NewsEntity> {
    return this.newsService.updateNews(id, game, file);
  }

  @Roles(Role.Admin)
  @UseInterceptors(TransformInterceptor('Successfully news article game!'))
  @Delete(':id')
  removeNews(@Param('id', ParseIntPipe) id: number): Promise<NewsEntity> {
    return this.newsService.removeNews(id);
  }
}
