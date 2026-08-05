import { cacheGet, cacheSet } from "../config/redis.js";

export const cacheMiddleware = (ttlSeconds = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const userId = req.user ? req.user._id.toString() : "public";
    const cacheKey = `cache:${req.originalUrl || req.url}:${userId}`;

    try {
      const cachedData = await cacheGet(cacheKey);

      if (cachedData) {
        res.setHeader("X-Cache", "HIT");
        return res.json(cachedData);
      }

      // Store original res.json
      const originalJson = res.json.bind(res);

      res.json = (body) => {
        res.setHeader("X-Cache", "MISS");
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cacheSet(cacheKey, body, ttlSeconds).catch(() => {});
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      next();
    }
  };
};

export default cacheMiddleware;
