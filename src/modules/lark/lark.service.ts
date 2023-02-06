import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LarkMessage } from './classes/LarkMessage';
import { LarkApiService } from './lark-api.service';

@Injectable()
export class LarkService {
  constructor(
    private readonly larkApiService: LarkApiService,
    private readonly configService: ConfigService,
  ) {}

  async replyMessage(data) {
    console.log('reply');
    // const message = new LarkMessage(data)
    // const message = new LarkMessage(data)
    // const { tenant_access_token } =
    //   await this.larkApiService.getTenantAccessToken();
    // const data = await this.larkApiService.sendMessage(
    //   tenant_access_token,
    //   message,
    // );
    // return data;
    console.log(data);
    const message = new LarkMessage('reply', data.event.message.chat_id);
    message.root_id = data.event.message.message_id;

    const { tenant_access_token } =
      await this.larkApiService.getTenantAccessToken();
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

    await this.replyMessage(data);
  }
}
