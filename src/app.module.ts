import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './game/entity/game.entity';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entity/user.entity';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BroadcastModule } from './broadcast/broadcast.module';
import { BroadcastEntity } from './broadcast/broadcast.entity';
import { CommentModule } from './broadcast_comment/broadcast_comment.module';
import { BroadcastCommentEntity } from './broadcast_comment/broadcast_comment.entity';
import { MulterModule } from '@nestjs/platform-express';
import { HighlightModule } from './highlight/highlight.module';
import { HighlightEntity } from './highlight/hightlight.entity';
import { NewsModule } from './news/news.module';
import { NewsEntity } from './news/news.entity';
import { NewsCommentModule } from './news_comment/news_comment.module';
import { NewsCommentEntity } from './news_comment/news_comment.entity';
import { HighlightCommentEntity } from './highlight_comment/highlight_comment.entity';
import { HighlightCommentModule } from './highlight_comment/highlight_comment.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DATABASE_HOST'),
        port: config.get('DATABASE_PORT'),
        username: config.get('DATABASE_USERNAME'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        entities: [
          GameEntity,
          UserEntity,
          BroadcastEntity,
          HighlightEntity,
          NewsEntity,
          BroadcastCommentEntity,
          NewsCommentEntity,
          HighlightCommentEntity,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    GameModule,
    UserModule,
    AuthModule,
    MailModule,
    BroadcastModule,
    CommentModule,
    HighlightModule,
    NewsModule,
    NewsCommentModule,
    HighlightCommentModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
