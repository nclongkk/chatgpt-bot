import { LarkModule } from './modules/lark/lark.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ChatAIModule } from './modules/gpt/chat-ai.module';
import {RedisHelperModule} from "./modules/redis-helper/redis-helper.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LarkModule,
    HttpModule,
    ChatAIModule,
    RedisHelperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
