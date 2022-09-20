import {
  Put,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
  Delete,
  Body,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from 'src/decorator/user.decorator';
import { Role } from 'src/role.enum';
import { Roles } from 'src/roles.decorator';
import { UserEntity } from 'src/user/entity/user.entity';
import TransformInterceptor from '../interceptors/transform.interceptor';
import { CreateNewsCommentDTO, UpdateNewsCommentDTO } from './news_comment.dto';
import { NewsCommentEntity } from './news_comment.entity';
import { NewsCommentService } from './news_comment.service';

@Controller('news-comment')
export class NewsCommentController {
  constructor(private newsCommentService: NewsCommentService) {}

  @UseInterceptors(TransformInterceptor('News comments found!'))
  @Get()
  getComments(
    @Query('newsId', new DefaultValuePipe(null)) newsId: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<NewsCommentEntity>> {
    return this.newsCommentService.getComments(newsId, search, {
      page,
      limit,
    });
  }

  @Roles(Role.Admin)
  @UseInterceptors(TransformInterceptor('Comment found!'))
  @Get(':id')
  getCommentById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NewsCommentEntity> {
    return this.newsCommentService.getCommentById(id);
  }

  @Roles(Role.User)
  @UseInterceptors(TransformInterceptor('Successfully created comment!'))
  @Post('me')
  async createComment(
    @Body() commentPayload: CreateNewsCommentDTO,
    @User() user: UserEntity,
  ): Promise<NewsCommentEntity> {
    return this.newsCommentService.createComment(commentPayload, user);
  }

  @Roles(Role.User)
  @UseInterceptors(TransformInterceptor('Successfully edited comment!'))
  @Put('me/:id')
  async editComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() commentPayload: UpdateNewsCommentDTO,
    @User() user: UserEntity,
  ): Promise<NewsCommentEntity> {
    return this.newsCommentService.editComment(id, commentPayload, user);
  }

  @Roles(Role.User)
  @UseInterceptors(TransformInterceptor('Successfully deleted comment!'))
  @Delete('me/:id')
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ): Promise<NewsCommentEntity> {
    return this.newsCommentService.deleteComment(id, user);
  }
}
