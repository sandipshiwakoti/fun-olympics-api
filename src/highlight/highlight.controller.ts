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
  UseInterceptors,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import TransformInterceptor from 'src/interceptors/transform.interceptor';
import { Role } from 'src/role.enum';
import { Roles } from 'src/roles.decorator';
import { CreateHighlightDTO, UpdateHighlightDTO } from './highlight.dto';
import { HighlightService } from './highlight.service';
import { HighlightEntity } from './hightlight.entity';

@Controller('highlight')
export class HighlightController {
  constructor(private highlightService: HighlightService) {}

  @UseInterceptors(TransformInterceptor('Highlights found!'))
  @Get('')
  getHighlights(
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<HighlightEntity>> {
    return this.highlightService.getHighlights(search, { page, limit });
  }

  @UseInterceptors(TransformInterceptor('Highlight found!'))
  @Get(':id')
  getHighlightById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HighlightEntity> {
    return this.highlightService.getHighlightById(id);
  }

  @Roles(Role.Admin)
  @UseInterceptors(TransformInterceptor('Successfully created highlight!'))
  @Post()
  async createHighlight(
    @Body() highlightPayload: CreateHighlightDTO,
  ): Promise<HighlightEntity> {
    return this.highlightService.createHighlight(highlightPayload);
  }

  @Roles(Role.Admin)
  @UseInterceptors(TransformInterceptor('Successfully updated highlight!'))
  @Put(':id')
  async updateHighlight(
    @Param('id', ParseIntPipe) id: number,
    @Body() highlightPayload: UpdateHighlightDTO,
  ): Promise<HighlightEntity> {
    return this.highlightService.updateHighlight(id, highlightPayload);
  }

  @Roles(Role.Admin)
  @UseInterceptors(TransformInterceptor('Successfully deleted highlight!'))
  @Delete(':id')
  removeHighlight(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HighlightEntity> {
    return this.highlightService.removeHighlight(id);
  }
}
