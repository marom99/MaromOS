# Redis In-Memory Fallback Plan

## Objective
Make local development setup easier by allowing `bun run dev` to start successfully without any Redis configuration. When no Redis environment variables are found, the application will automatically fall back to an in-memory Redis mock using `ioredis-mock`.

## Key Files & Context
- `package.json`: Needs `ioredis-mock` added as a dev dependency.
- `api/_utils/redis.ts`: Handles Redis client instantiation and config validation.
- `scripts/api-standalone-server.ts`: Validates environment variables on standalone server startup.

## Implementation Steps

1. **Install Dependency:**
   - Add `"ioredis-mock"` to `devDependencies` in `package.json`.

2. **Update `api/_utils/redis.ts`:**
   - Update the `RedisBackend` type to include `"memory"`: `export type RedisBackend = "upstash-rest" | "redis-url" | "memory";`.
   - In `getRedisBackend()`, replace the final `throw new Error(...)` with a fallback to return `"memory"`, logging a helpful warning: `"⚠️ No Redis configuration found. Falling back to in-memory mock. Data will be lost on restart."`
   - In `getStandardRedisClient()`, if `getRedisBackend() === "memory"`, dynamically `require("ioredis-mock")` and return an instance of `RedisMock` instead of throwing an error.
   - Do the same fallback inside `getSharedPubSubClient()` for the Pub/Sub clients.
   - Ensure `supportsRedisPubSub()` returns `true` for `"memory"` so realtime features work.

3. **Update `scripts/api-standalone-server.ts`:**
   - In the `validateEnv()` function, update the `required` variables check. If `redisBackend === "memory"`, do not require any Redis environment variables.

## Verification & Testing
- Run `bun run dev` with no `.env` file or Redis environment variables set.
- Verify the server starts successfully without the `"Missing Redis configuration"` error.
- Verify that a warning is printed to the console indicating the fallback to the in-memory mock.
- Verify that features relying on Redis (like chat or presence) continue to function normally during the session (though data will not persist across restarts).