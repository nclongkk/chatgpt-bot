import * as dotEnv from 'dotenv';
dotEnv.config();

export const CHAT_AI_API_ENDPOINT = {
  CREATE_COMPLETION: process.env.GPT_API_URL + '/v1/completions',
};
