import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BroadcastService } from 'src/broadcast/broadcast.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import {
  CreateBroadcastCommentDTO,
  UpdateBroadcastCommentDTO,
} from './broadcast_comment.dto';
import { BroadcastCommentEntity } from './broadcast_comment.entity';

@Injectable()
export class BroadcastCommentService {
  constructor(
    @InjectRepository(BroadcastCommentEntity)
    private commentRepository: Repository<BroadcastCommentEntity>,
    private broadcastService: BroadcastService,
    private userService: UserService,
  ) {}

  async getComments(): Promise<BroadcastCommentEntity[]> {
    const comments = await this.commentRepository.find({
      relations: ['broadcast', 'author'],
    });

    if (!comments || !comments[0]) {
      throw new HttpException('Comments not found!', HttpStatus.NOT_FOUND);
    }

    return comments;
  }

  async getCommentById(id: number): Promise<BroadcastCommentEntity> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['broadcast', 'author'],
    });

    if (!comment) {
      throw new HttpException('Comment not found!', HttpStatus.NOT_FOUND);
    }

    return comment;
  }

  async createComment(
    commentPayload: CreateBroadcastCommentDTO,
    user: UserEntity,
  ): Promise<BroadcastCommentEntity> {
    const author = await this.userService.getUserById(user.id);
    const broadcast = await this.broadcastService.getBroadcastById(
      commentPayload.broadcastId,
    );

    const newComment = await this.commentRepository.save({
      content: commentPayload.content,
      commentedAt: new Date(),
      author,
      broadcast,
    });
    return newComment;
  }

  async editComment(
    id: number,
    commentPayload: UpdateBroadcastCommentDTO,
    user: UserEntity,
  ): Promise<BroadcastCommentEntity> {
    const author = await this.userService.getUserById(user.id);
    const comment = await this.commentRepository.findOneBy({
      id,
      author,
    });

    if (!comment) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    comment.content = commentPayload.content;
    const newComment = await this.commentRepository.save(comment);
    return newComment;
  }

  async deleteComment(
    id: number,
    user: UserEntity,
  ): Promise<BroadcastCommentEntity> {
    const author = await this.userService.getUserById(user.id);
    const comment = await this.commentRepository.findOneBy({
      id,
      author,
    });

    if (!comment) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const deletedComment = await this.commentRepository.remove(comment);
    return deletedComment;
  }
}
