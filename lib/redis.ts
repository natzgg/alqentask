import { Redis } from "ioredis";

export const redis = new Redis(
  `rediss://default:${process.env.REDIS_KEY}@witty-dane-55448.upstash.io:6379`
);
