import { Injectable, Logger } from '@nestjs/common';
import { RedisClientProvider } from '../repository';

const oneMinuteInSeconds = 60;

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly redisClient: RedisClientProvider) {}

  async set(
    key: string,
    value: any,
    keyType: string = 'air',
    expiry: number = oneMinuteInSeconds,
  ): Promise<void> {
    try {
      const redisKey = `${keyType}:${key}`;
      await this.redisClient.getRedisInstance().set(redisKey, JSON.stringify(value), 'EX', expiry);
    } catch (error) {
      this.logger.error(`Failed to set cache for key ${key}: ${error.message}`, error.stack);
    }
  }

  async get(
    key: string,
    keyType: string = 'air',
    pagination?:{page: number, limit: number}
  ): Promise<any> {
    try {
      const redisKey = `${keyType}:${key}`;
      const data = await this.redisClient.getRedisInstance().get(redisKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error(`Failed to get cache for key ${key}: ${error.message}`, error.stack);
      return null;
    }
  }

  async delete(
    key: string,
    keyType: string = 'air',
  ): Promise<void> {
    try {
      const redisKey = `${keyType}:${key}`;
      await this.redisClient.getRedisInstance().del(redisKey);
    } catch (error) {
      this.logger.error(`Failed to delete cache for key ${key}: ${error.message}`, error.stack);
    }
  }

  async clearAllCache(): Promise<void> {
    try {
      const redisClient = this.redisClient.getRedisInstance();
      await redisClient.flushall();
    } catch (error) {
      this.logger.error(`Failed to clear all cache: ${error.message}`, error.stack);
    }
  }
}
