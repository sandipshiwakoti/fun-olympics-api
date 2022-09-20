import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { BroadcastService } from 'src/broadcast/broadcast.service';
import { Repository } from 'typeorm';
import { CreateHighlightDTO, UpdateHighlightDTO } from './highlight.dto';
import { HighlightEntity } from './hightlight.entity';

@Injectable()
export class HighlightService {
  constructor(
    @InjectRepository(HighlightEntity)
    private highlightRepository: Repository<HighlightEntity>,
    private broadcastService: BroadcastService,
  ) {}

  async getHighlights(
    search: string,
    options: IPaginationOptions,
  ): Promise<Pagination<HighlightEntity>> {
    const queryBuilder = this.highlightRepository
      .createQueryBuilder('h')
      .leftJoinAndSelect('h.broadcast', 'broadcast')
      .where('h.title like :search', { search: `%${search}%` })
      .where('h.description like :search', { search: `%${search}%` });

    return paginate<HighlightEntity>(queryBuilder, options);
  }

  async getHighlightById(id: number): Promise<HighlightEntity> {
    const highlight = await this.highlightRepository.findOne({
      where: { id },
      relations: ['broadcast', 'comments.author'],
    });
    if (!highlight) {
      throw new HttpException('Highlight not found', HttpStatus.NOT_FOUND);
    }
    return highlight;
  }

  async createHighlight(highlightPayload: CreateHighlightDTO) {
    const broadcast = await this.broadcastService.getBroadcastById(
      highlightPayload.broadcastId,
    );

    const { title, description, link } = highlightPayload;
    const newHighlight = await this.highlightRepository.save({
      title,
      description,
      link,
      broadcast,
    });
    return newHighlight;
  }

  async updateHighlight(
    id: number,
    highlightPayload: UpdateHighlightDTO,
  ): Promise<HighlightEntity> {
    const highlight = await this.getHighlightById(id);
    highlight.title = highlightPayload.title;
    highlight.description = highlightPayload.description;
    highlight.link = highlightPayload.link;
    highlight.broadcast.id = highlightPayload.broadcastId;

    const updateHighlight = await this.highlightRepository.save(highlight);
    return updateHighlight;
  }

  async removeHighlight(id: number): Promise<HighlightEntity> {
    const highlight = await this.getHighlightById(id);
    const deletedHighlight = await this.highlightRepository.remove(highlight);
    return deletedHighlight;
  }
}
