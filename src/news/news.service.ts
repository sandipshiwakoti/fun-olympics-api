import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { CreateNewsDTO, UpdateNewsDTO } from './news.dto';
import { NewsEntity } from './news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private newsRepository: Repository<NewsEntity>,
  ) {}

  async getNews(
    search: string,
    options: IPaginationOptions,
  ): Promise<Pagination<NewsEntity>> {
    const queryBuilder = this.newsRepository
      .createQueryBuilder('n')
      .where('n.title like :search', { search: `%${search}%` })
      .where('n.description like :search', { search: `%${search}%` });

    return paginate<NewsEntity>(queryBuilder, options);
  }

  async getNewsById(id: number): Promise<NewsEntity> {
    const newsArticle = await this.newsRepository.findOne({
      where: { id },
      relations: ['comments.author'],
    });

    if (!newsArticle) {
      throw new HttpException('News article not found', 404);
    }
    return newsArticle;
  }

  async createNews(
    news: CreateNewsDTO,
    file: Express.Multer.File,
  ): Promise<NewsEntity> {
    const newNewsArticle = await this.newsRepository.save({
      ...news,
      img: file ? file.path : null,
    });
    return newNewsArticle;
  }

  async updateNews(
    id: number,
    newsPayload: UpdateNewsDTO,
    file: Express.Multer.File,
  ): Promise<NewsEntity> {
    const newsArticle = await this.getNewsById(id);
    newsArticle.title = newsPayload.title;
    newsArticle.description = newsPayload.description;
    newsArticle.author = newsPayload.author;
    newsArticle.publishedAt = newsPayload.publishedAt;

    if (file) {
      newsArticle.img = file.path;
    }

    const updatedNewsArticle = await this.newsRepository.save(newsArticle);
    return updatedNewsArticle;
  }

  async removeNews(id: number): Promise<NewsEntity> {
    const newsArticle = await this.getNewsById(id);
    const deletedNewsArticle = await this.newsRepository.remove(newsArticle);
    return deletedNewsArticle;
  }
}
