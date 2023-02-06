import { Provider } from '@nestjs/common';
import * as Redis from 'redis';
import { REDIS_CLIENT } from './redis-helper.constant';

export type RedisClient = ReturnType<typeof Redis.createClient>;

export const redisProviders: Provider[] = [
  {
    useFactory: (): RedisClient => {
      const url = process.env.REDIS_USER
        ? `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
        : `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
      return Redis.createClient({
        url,
      });
    },
    provide: REDIS_CLIENT,
  },
];
