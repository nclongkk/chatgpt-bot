import { ConfigService, ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { LarkApiService } from './lark-api.service';
import { LarkController } from './lark.controller';
import { LarkService } from './lark.service';
import { ChatAIModule } from '../gpt/chat-ai.module';

@Module({
  imports: [HttpModule, ConfigModule, ChatAIModule],
  providers: [LarkService, LarkApiService],
  controllers: [LarkController],
  exports: [LarkService, LarkApiService],
})
export class LarkModule {}
