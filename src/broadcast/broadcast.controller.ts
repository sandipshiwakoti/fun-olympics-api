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
import { CreateBroadcastDTO, UpdateBroadcastDTO } from './broadcast.dto';
import { BroadcastEntity } from './broadcast.entity';
import { BroadcastService } from './broadcast.service';

@Controller('broadcast')
export class BroadcastController {
  constructor(private broadcastService: BroadcastService) {}

  @UseInterceptors(TransformInterceptor('Broadcasts found!'))
  @Get('')
  getBroadcasts(
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<BroadcastEntity>> {
    return this.broadcastService.getBroadcasts(search, { page, limit });
  }

  // @UseInterceptors(TransformInterceptor('Broadcasts found!'))
  // @Get('')
  // getBroadcasts(): Promise<BroadcastEntity[]> {
  //   return this.broadcastService.getBroadcasts();
  // }

  @Get(':id')
  @UseInterceptors(TransformInterceptor('Broadcast found!'))
  getBroadcastById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BroadcastEntity> {
    return this.broadcastService.getBroadcastById(id);
  }

  @Roles(Role.Admin)
  @UseInterceptors(TransformInterceptor('Successfully created broadcast!'))
  @Post()
  async createBroadcast(
    @Body() broadcastPayload: CreateBroadcastDTO,
  ): Promise<BroadcastEntity> {
    return this.broadcastService.createBroadcast(broadcastPayload);
  }

  @Roles(Role.Admin)
  @UseInterceptors(TransformInterceptor('Successfully updated broadcast!'))
  @Put(':id')
  async updateBroadcast(
    @Param('id', ParseIntPipe) id: number,
    @Body() broadcastPayload: UpdateBroadcastDTO,
  ): Promise<BroadcastEntity> {
    return this.broadcastService.updateBroadcast(id, broadcastPayload);
  }

  @Roles(Role.Admin)
  @UseInterceptors(TransformInterceptor('Successfully deleted broadcast!'))
  @Delete(':id')
  removeBroadcast(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BroadcastEntity> {
    return this.broadcastService.removeBroadcast(id);
  }
}
