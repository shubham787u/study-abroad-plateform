import Redis from "ioredis";
import NodeCache from "node-cache";

const inMemoryCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
let redisClient = null;
let isRedisConnected = false;

const initRedis = () => {
  if (process.env.NODE_ENV === "test") {
    // Use in-memory cache during tests
    return null;
  }

  try {
    const host = process.env.REDIS_HOST || "127.0.0.1";
    const port = parseInt(process.env.REDIS_PORT || "6379", 10);

    redisClient = new Redis({
      host,
      port,
      retryStrategy(times) {
        if (times > 3) {
          // Stop retrying after 3 attempts and fall back to NodeCache silently
          return null;
        }
        return Math.min(times * 100, 2000);
      },
      lazyConnect: true,
    });

    redisClient.on("connect", () => {
      isRedisConnected = true;
      console.log("[Redis] Connected successfully");
    });

    redisClient.on("error", (err) => {
      isRedisConnected = false;
      // Suppress noisy output after fallback
    });

    redisClient.connect().catch(() => {
      isRedisConnected = false;
    });

    return redisClient;
  } catch (error) {
    console.log("[Redis] Initialization failed, using in-memory cache fallback");
    return null;
  }
};

initRedis();

export const cacheGet = async (key) => {
  try {
    if (isRedisConnected && redisClient) {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    }
  } catch (err) {
    isRedisConnected = false;
  }
  const val = inMemoryCache.get(key);
  return val ? JSON.parse(JSON.stringify(val)) : null;
};

export const cacheSet = async (key, value, ttlSeconds = 300) => {
  try {
    if (isRedisConnected && redisClient) {
      await redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
    }
  } catch (err) {
    isRedisConnected = false;
  }
  inMemoryCache.set(key, value, ttlSeconds);
};

export const cacheDel = async (patternOrKey) => {
  try {
    if (isRedisConnected && redisClient) {
      if (patternOrKey.includes("*")) {
        const keys = await redisClient.keys(patternOrKey);
        if (keys.length > 0) {
          await redisClient.del(...keys);
        }
      } else {
        await redisClient.del(patternOrKey);
      }
    }
  } catch (err) {
    isRedisConnected = false;
  }
  if (patternOrKey.includes("*")) {
    inMemoryCache.flushAll();
  } else {
    inMemoryCache.del(patternOrKey);
  }
};

export default {
  cacheGet,
  cacheSet,
  cacheDel,
};
