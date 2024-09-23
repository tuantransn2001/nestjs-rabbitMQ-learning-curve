import { AUTH_TOKEN_SERVICE } from 'apps/auth-token-service/constants/service';
import { USER_SERVICE } from 'apps/user-service/constants/service';

export const ENVConfig = () => ({
  database: {
    connection_string: process.env.MONGODB_CONNECTION_STRING,
  },
  jwt: {
    private_key: process.env.JWT_PRIVATE_KEY,
    life_time: process.env.JWT_LIFE_TIME,
    refresh_key: process.env.JWT_REFRESH_KEY,
    refresh_life_time: process.env.JWT_REFRESH_LIFE_TIME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    ttl: Number(process.env.REDIS_TTL),
  },
  rabbitMq: {
    connection_string: process.env.RABBIT_MQ_URI || 'amqp://rabbitMQ:5672 ',
    names: {
      [USER_SERVICE]: process.env.RABBIT_MQ_USER_QUEUE,
      [AUTH_TOKEN_SERVICE]: process.env.RABBIT_MQ_AUTH_TOKEN_QUEUE,
    },
  },
});
