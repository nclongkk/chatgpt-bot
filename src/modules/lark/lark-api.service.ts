import { LarkMessage } from './classes/LarkMessage';
import { lastValueFrom } from 'rxjs';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { HttpService } from '@nestjs/axios';

import { ILarkMessage } from './interface/lark-message.interface';
import { LARK_API_ENDPOINT } from './constants/lark-api.constants';
import { IRequestConfig } from '../common/interface/request-config.interface';

@Injectable({ scope: Scope.REQUEST })
export class LarkApiService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(REQUEST) private request,
  ) {}

  async apiCall(requestConfig: IRequestConfig) {
    try {
      const { data } = await lastValueFrom(
        this.httpService.request(requestConfig),
      );
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getTenantAccessToken(): Promise<{
    tenant_access_token: string;
    expire: number;
  }> {
    const { tenant_access_token, expire } = await this.apiCall({
      url: LARK_API_ENDPOINT.GET_TENANT_ACCESS_TOKEN,
      method: 'POST',
      data: {
        app_id: this.configService.get('LARK_APP_ID'),
        app_secret: this.configService.get('LARK_APP_SECRET'),
      },
    });

    return { tenant_access_token, expire };
  }

  async getGroups(tenantAccessToken: string): Promise<{ groups: any[] }> {
    const { data } = await this.apiCall({
      url: LARK_API_ENDPOINT.GET_GROUPS,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tenantAccessToken}`,
      },
    });
    return { groups: data.groups };
  }

  async sendMessage(tenantAccessToken: string, message: LarkMessage) {
    const { data } = await this.apiCall({
      url: LARK_API_ENDPOINT.SEND_MESSAGE,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tenantAccessToken}`,
      },
      params: {
        receive_id_type: message.receive_id_type,
      },
      data: message.export(),
    });
    return data;
  }

  async replyMessage(tenantAccessToken: string, message: LarkMessage) {
    await this.apiCall({
      url: LARK_API_ENDPOINT.REPLY_MESSAGE(message.root_id),
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tenantAccessToken}`,
      },
      data: message.export(),
    });
  }
}
