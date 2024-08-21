import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const config: ConfigService = new ConfigService();

export default () => ({
    app: {
        name: config.get<string>('APP_NAME'),
        port: config.get<number>('APP_PORT') || 3000,
        debug: config.get<string>('APP_DEBUG') || 'false',
        timeout: config.get<string>('TIMEOUT_IN_MILLISECONDS') || '60000',
        timezone: config.get<string>('APP_TIMEZONE'),
        url: config.get<string>('API_URL'),
        origin: config.get<string>('API_URL'),
      },

    iqair:{
      api_key: config.get<string>('IQAIR_API_KEY'),
    },

    db: {
      type: config.get<string>('DB_TYPE'),
      username: config.get<string>('DB_USERNAME'),
      password: config.get<string>('DB_PASSWORD'),
      dbname: config.get<string>('DB_NAME'),
      port: config.get<string>('DB_PORT'),
      host: config.get<string>('DB_HOST'),
    },

    redis: {
      host: config.get<any>('REDIS_HOST'),
      port: config.get<number>('REDIS_PORT'),
    },
});
