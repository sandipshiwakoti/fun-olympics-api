import {
  Request,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseInterceptors,
  UploadedFile,
  Post,
  Body,
  Delete,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import TransformInterceptor from 'src/interceptors/transform.interceptor';
import { Role } from 'src/role.enum';
import { Roles } from 'src/roles.decorator';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { multerOptions } from 'src/utils/multer-options';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @Roles(Role.Admin)
  // @UseInterceptors(TransformInterceptor('Users found!'))
  // @Get()
  // getUsers(): Promise<UserEntity[]> {
  //   return this.userService.getUsers();
  // }

  @Roles(Role.Admin)
  @UseInterceptors(TransformInterceptor('Users found!'))
  @Get()
  getNews(
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<UserEntity>> {
    return this.userService.getUsers(search, { page, limit });
  }

  @UseInterceptors(TransformInterceptor('User found!'))
  @Roles(Role.Admin)
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.getUserById(id);
  }

  @UseInterceptors(TransformInterceptor('User profile found!'))
  @Get('profile/me')
  getOwnProfile(@Request() req): Promise<UserEntity> {
    return this.userService.getOwnProfile(req);
  }

  @UseInterceptors(
    FileInterceptor('file', multerOptions),
    TransformInterceptor('Successfully created account!'),
  )
  @Roles(Role.Admin)
  @Post()
  async createUser(
    @Body()
    user: CreateUserDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.createUser(user, file);
  }

  @Roles(Role.Admin)
  @UseInterceptors(
    FileInterceptor('file', multerOptions),
    TransformInterceptor('Successfully updated user!'),
  )
  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userPayload: UpdateUserDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserEntity> {
    return this.userService.updateUser(id, userPayload, file);
  }

  @UseInterceptors(
    FileInterceptor('file', multerOptions),
    TransformInterceptor('Successfully updated profile!'),
  )
  @Put('profile/me')
  updateOwnProfile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ): Promise<UserEntity> {
    return this.userService.updateOwnProfile(file, req);
  }

  @Roles(Role.Admin)
  @UseInterceptors(TransformInterceptor('Successfully deleted user!'))
  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.removeUser(id);
  }
}
