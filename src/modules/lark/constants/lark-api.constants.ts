import * as dotEnv from 'dotenv';
dotEnv.config();

export const LARK_API_ENDPOINT = {
  GET_TENANT_ACCESS_TOKEN:
    process.env.LARK_API_URL +
    '/open-apis/auth/v3/tenant_access_token/internal/',
  GET_GROUPS: process.env.LARK_API_URL + '/open-apis/chat/v4/list',
  SEND_MESSAGE: process.env.LARK_API_URL + '/open-apis/message/v4/send/',
  REPLY_MESSAGE: (messageId: string) =>
    process.env.LARK_API_URL + `/open-apis/im/v1/messages/${messageId}/reply/`,
};
