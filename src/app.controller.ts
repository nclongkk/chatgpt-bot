import { AESCipher } from './modules/lark/classes/AESCipher';
import { LarkApiService } from './modules/lark/lark-api.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private larkApiService: LarkApiService,
  ) {}

  @Get()
  async getHello() {
    const { tenant_access_token } =
      await this.larkApiService.getTenantAccessToken();
    console.log(tenant_access_token);

    const { groups } = await this.larkApiService.getGroups(tenant_access_token);
    console.log(groups);
    return this.appService.getHello();
  }
}
