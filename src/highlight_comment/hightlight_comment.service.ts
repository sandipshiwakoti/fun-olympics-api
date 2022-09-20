import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { HighlightService } from 'src/highlight/highlight.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import {
  CreateHighlightCommentDTO,
  UpdateHighlightCommentDTO,
} from './highlight_comment.dto';
import { HighlightCommentEntity } from './highlight_comment.entity';

@Injectable()
export class HighlightCommentService {
  constructor(
    @InjectRepository(HighlightCommentEntity)
    private commentRepository: Repository<HighlightCommentEntity>,
    private highlightService: HighlightService,
    private userService: UserService,
  ) {}

  async getComments(
    highlightId: number,
    search: string,
    options: IPaginationOptions,
  ): Promise<Pagination<HighlightCommentEntity>> {
    if (!highlightId) {
      throw new HttpException(
        'Highlight comments not found!',
        HttpStatus.NOT_FOUND,
      );
    }
    const queryBuilder = this.commentRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.author', 'author')
      .innerJoinAndSelect(
        'c.highlight',
        'highlight',
        'highlight.id = :highlightId',
        { highlightId },
      )
      .where('c.title like :search', { search: `%${search}%` })
      .where('c.content like :search', { search: `%${search}%` })
      .orderBy('commentedAt', 'DESC');
    return paginate<HighlightCommentEntity>(queryBuilder, options);
  }

  async getCommentById(id: number): Promise<HighlightCommentEntity> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['highlight', 'author'],
    });

    if (!comment) {
      throw new HttpException('Comment not found!', HttpStatus.NOT_FOUND);
    }

    return comment;
  }

  async createComment(
    commentPayload: CreateHighlightCommentDTO,
    user: UserEntity,
  ): Promise<HighlightCommentEntity> {
    const author = await this.userService.getUserById(user.id);
    const highlight = await this.highlightService.getHighlightById(
      commentPayload.highlightId,
    );

    const newComment = await this.commentRepository.save({
      content: commentPayload.content,
      commentedAt: new Date(),
      author,
      highlight,
    });
    return newComment;
  }

  async editComment(
    id: number,
    commentPayload: UpdateHighlightCommentDTO,
    user: UserEntity,
  ): Promise<HighlightCommentEntity> {
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
  ): Promise<HighlightCommentEntity> {
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
