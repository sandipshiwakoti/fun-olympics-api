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
import {
  CreateHighlightCommentDTO,
  UpdateHighlightCommentDTO,
} from './highlight_comment.dto';
import { HighlightCommentEntity } from './highlight_comment.entity';
import { HighlightCommentService } from './hightlight_comment.service';

@Controller('highlight-comment')
export class HighlightCommentController {
  constructor(private highlightCommentService: HighlightCommentService) {}

  @UseInterceptors(TransformInterceptor('Highlight comments found!'))
  @Get()
  getComments(
    @Query('highlightId', new DefaultValuePipe(null)) highlightId: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<HighlightCommentEntity>> {
    return this.highlightCommentService.getComments(highlightId, search, {
      page,
      limit,
    });
  }

  @Roles(Role.Admin)
  @UseInterceptors(TransformInterceptor('Comment found!'))
  @Get(':id')
  getCommentById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HighlightCommentEntity> {
    return this.highlightCommentService.getCommentById(id);
  }

  @Roles(Role.User)
  @UseInterceptors(TransformInterceptor('Successfully created comment!'))
  @Post('me')
  async createComment(
    @Body() commentPayload: CreateHighlightCommentDTO,
    @User() user: UserEntity,
  ): Promise<HighlightCommentEntity> {
    return this.highlightCommentService.createComment(commentPayload, user);
  }

  @Roles(Role.User)
  @UseInterceptors(TransformInterceptor('Successfully edited comment!'))
  @Put('me/:id')
  async editComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() commentPayload: UpdateHighlightCommentDTO,
    @User() user: UserEntity,
  ): Promise<HighlightCommentEntity> {
    return this.highlightCommentService.editComment(id, commentPayload, user);
  }

  @Roles(Role.User)
  @UseInterceptors(TransformInterceptor('Successfully deleted comment!'))
  @Delete('me/:id')
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ): Promise<HighlightCommentEntity> {
    return this.highlightCommentService.deleteComment(id, user);
  }
}
