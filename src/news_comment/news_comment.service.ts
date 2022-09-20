import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { NewsService } from 'src/news/news.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateNewsCommentDTO, UpdateNewsCommentDTO } from './news_comment.dto';
import { NewsCommentEntity } from './news_comment.entity';

@Injectable()
export class NewsCommentService {
  constructor(
    @InjectRepository(NewsCommentEntity)
    private newsCommentRepository: Repository<NewsCommentEntity>,
    private newsService: NewsService,
    private userService: UserService,
  ) {}

  async getComments(
    newsId: number,
    search: string,
    options: IPaginationOptions,
  ): Promise<Pagination<NewsCommentEntity>> {
    if (!newsId) {
      throw new HttpException('News comments not found!', HttpStatus.NOT_FOUND);
    }
    const queryBuilder = this.newsCommentRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.author', 'author')
      .innerJoinAndSelect('c.news', 'news', 'news.id = :newsId', { newsId })
      .where('c.title like :search', { search: `%${search}%` })
      .where('c.content like :search', { search: `%${search}%` })
      .orderBy('commentedAt', 'DESC');
    return paginate<NewsCommentEntity>(queryBuilder, options);
  }

  async getCommentById(id: number): Promise<NewsCommentEntity> {
    const comment = await this.newsCommentRepository.findOne({
      where: { id },
      relations: ['news', 'author'],
    });

    if (!comment) {
      throw new HttpException('Comment not found!', HttpStatus.NOT_FOUND);
    }

    return comment;
  }

  async createComment(
    commentPayload: CreateNewsCommentDTO,
    user: UserEntity,
  ): Promise<NewsCommentEntity> {
    const author = await this.userService.getUserById(user.id);
    const news = await this.newsService.getNewsById(commentPayload.newsId);

    const newComment = await this.newsCommentRepository.save({
      content: commentPayload.content,
      commentedAt: new Date(),
      author,
      news,
    });
    return newComment;
  }

  async editComment(
    id: number,
    commentPayload: UpdateNewsCommentDTO,
    user: UserEntity,
  ): Promise<NewsCommentEntity> {
    const author = await this.userService.getUserById(user.id);
    const comment = await this.newsCommentRepository.findOneBy({
      id,
      author,
    });

    if (!comment) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    comment.content = commentPayload.content;
    const newComment = await this.newsCommentRepository.save(comment);
    return newComment;
  }

  async deleteComment(
    id: number,
    user: UserEntity,
  ): Promise<NewsCommentEntity> {
    const author = await this.userService.getUserById(user.id);
    const comment = await this.newsCommentRepository.findOneBy({
      id,
      author,
    });

    if (!comment) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const deletedComment = await this.newsCommentRepository.remove(comment);
    return deletedComment;
  }
}
