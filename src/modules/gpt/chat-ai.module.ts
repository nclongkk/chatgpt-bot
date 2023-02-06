import { ConfigService, ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ChatAPIService } from './chat-api.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [ChatAPIService],
  exports: [ChatAPIService],
})
export class ChatAIModule {}
