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
} from '@nestjs/common';
import { Role } from 'src/role.enum';
import { Roles } from 'src/roles.decorator';
import { BroadcastCommentService } from './broadcast_comment.service';
import TransformInterceptor from '../interceptors/transform.interceptor';
import { BroadcastCommentEntity } from './broadcast_comment.entity';
import {
  CreateBroadcastCommentDTO,
  UpdateBroadcastCommentDTO,
} from './broadcast_comment.dto';
import { User } from 'src/decorator/user.decorator';
import { UserEntity } from 'src/user/entity/user.entity';

@Controller('broadcast-comment')
export class BroadcastCommentController {
  constructor(private broadcastCommentService: BroadcastCommentService) {}

  @Roles(Role.Admin)
  @UseInterceptors(TransformInterceptor('Comments found!'))
  @Get()
  getComments(): Promise<BroadcastCommentEntity[]> {
    return this.broadcastCommentService.getComments();
  }

  @Roles(Role.Admin)
  @UseInterceptors(TransformInterceptor('Comment found!'))
  @Get(':id')
  getCommentById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BroadcastCommentEntity> {
    return this.broadcastCommentService.getCommentById(id);
  }

  @Roles(Role.User)
  @UseInterceptors(TransformInterceptor('Successfully created comment!'))
  @Post('me')
  async createComment(
    @Body() commentPayload: CreateBroadcastCommentDTO,
    @User() user: UserEntity,
  ): Promise<BroadcastCommentEntity> {
    return this.broadcastCommentService.createComment(commentPayload, user);
  }

  @Roles(Role.User)
  @UseInterceptors(TransformInterceptor('Successfully edited comment!'))
  @Put('me/:id')
  async editComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() commentPayload: UpdateBroadcastCommentDTO,
    @User() user: UserEntity,
  ): Promise<BroadcastCommentEntity> {
    return this.broadcastCommentService.editComment(id, commentPayload, user);
  }

  @Roles(Role.User)
  @UseInterceptors(TransformInterceptor('Successfully deleted comment!'))
  @Delete('me/:id')
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ): Promise<BroadcastCommentEntity> {
    return this.broadcastCommentService.deleteComment(id, user);
  }
}
