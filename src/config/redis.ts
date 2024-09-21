import "dotenv/config";

import { createClient } from "redis";

const host = process.env.REDIS_HOST || "localhost";
const port = process.env.REDIS_PORT || 6379;
const redisOption = { url: `redis://${host}:${port}/8`, network_timeout: 5 };
const client = createClient(redisOption);

export default client;
