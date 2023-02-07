import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LarkMessage } from './classes/LarkMessage';
import { LarkApiService } from './lark-api.service';
import { ChatAPIService } from '../gpt/chat-api.service';
import { RedisHelperService } from '../redis-helper/redis-helper.service';

@Injectable()
export class LarkService {
  constructor(
    private readonly larkApiService: LarkApiService,
    private readonly configService: ConfigService,
    private readonly chatAIService: ChatAPIService,
    private readonly redisHelperService: RedisHelperService,
  ) {}

  async replyMessage(data) {
    // const message = new LarkMessage(data)
    // const message = new LarkMessage(data)
    // const { tenant_access_token } =
    //   await this.larkApiService.getTenantAccessToken();
    // const data = await this.larkApiService.sendMessage(
    //   tenant_access_token,
    //   message,
    // );
    // return data;
    const mentionKeys = (data?.event?.message?.mentions || []).map(
      (mention) => mention.key,
    );
    const regex = new RegExp(`/${mentionKeys.join('|')}/`);
    let text = JSON.parse(data?.event?.message?.content || '{"text": ""}').text;

    // console.log(text.replace(regex, ''))

    for (const mentionKey of mentionKeys) {
      text = text.replace(mentionKey, '');
    }

    const aiResponseText = await this.chatAIService.createCompletions(text);

    const message = new LarkMessage(aiResponseText, data.event.message.chat_id);
    message.root_id = data.event.message.message_id;

    const tenant_access_token = await this.getTenantAccessToken();
    await this.larkApiService.replyMessage(tenant_access_token, message);
  }

  checkIfBotIsMentioned(data) {
    if (data.event.message.mentions) {
      for (const mention of data.event.message.mentions) {
        if (mention.id.open_id === this.configService.get('LARK_BOT_OPEN_ID')) {
          return true;
        }
      }
    }
    return false;
  }

  async handleMessageReceive(data) {
    if (
      data.event.message.chat_type === 'group' &&
      !this.checkIfBotIsMentioned(data)
    ) {
      return;
    }
    const messageId = data.event.message.message_id;
    if (await this.redisHelperService.getKey(messageId)) return;
    await this.redisHelperService.setKey(
      messageId,
      { received: true },
      60 * 10,
    );

    await this.replyMessage(data);
  }

  async getTenantAccessToken(): Promise<string> {
    const redisKey = `lark-tenantAccessToken`;

    const result = await this.redisHelperService.getKey(redisKey);

    if (result) return result.tenant_access_token;

    const { tenant_access_token, expire } =
      await this.larkApiService.getTenantAccessToken();

    await this.redisHelperService.setKey(
      redisKey,
      { tenant_access_token },
      expire - 60,
    );

    return tenant_access_token;
  }
}
