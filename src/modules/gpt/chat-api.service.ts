import { lastValueFrom } from 'rxjs';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { HttpService } from '@nestjs/axios';

import { IRequestConfig } from '../common/interface/request-config.interface';
import { CHAT_AI_API_ENDPOINT } from './constants/chat-gpt-api.constants';

@Injectable({ scope: Scope.REQUEST })
export class ChatAPIService {
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

  async createCompletions(text: string): Promise<string> {
    const { choices } = await this.apiCall({
      url: CHAT_AI_API_ENDPOINT.CREATE_COMPLETION,
      headers: {
        Authorization: `Bearer ${this.configService.get('OPEN_CHAT_AI_KEY')}`,
      },
      method: 'POST',
      data: {
        model: 'text-davinci-003',
        prompt: text,
        temperature: 1,
        max_tokens: 512,
        top_p: 0.9,
        stop: ['<|endoftext|>'],
      },
    });

    return choices?.[0]?.text || '';
  }
}
