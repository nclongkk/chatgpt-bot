import { ConfigService } from '@nestjs/config';
import { Body, Post, Controller, Res } from '@nestjs/common';
import { LarkService } from './lark.service';
import { AESCipher } from './classes/AESCipher';

@Controller('/lark')
export class LarkController {
  constructor(
    private readonly larkService: LarkService,
    private configService: ConfigService,
  ) {}

  @Post('webhook')
  async receiveWebhook(@Body() data, @Res() res) {
    const LARK_BOT_ENCRYPT_KEY = this.configService.get('LARK_BOT_ENCRYPT_KEY');
    const cipher = new AESCipher(LARK_BOT_ENCRYPT_KEY);
    const event = JSON.parse(cipher.decrypt(data.encrypt));
    if (event.type === 'url_verification') {
      return res.status(200).send(event);
    }

    switch (event.header.event_type) {
      case 'im.message.receive_v1': {
        this.larkService
          .handleMessageReceive(event)
          .catch((e) => console.log(e));
        break;
      }

      default: {
        console.log('Unhandled event type');
      }
    }

    return res.status(200).send();
  }
}
