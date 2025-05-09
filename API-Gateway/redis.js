const Redis = require('ioredis');

// Debug environment variables
console.log('Redis Environment Variables:');
console.log('REDIS_URL:', process.env.REDIS_URL);

// Force local Redis connection
const redisUrl = 'redis://localhost:6378';
console.log('Using Redis URL:', redisUrl);

const redis = new Redis(redisUrl, {
  retryStrategy: function(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  connectTimeout: 10000,
  enableReadyCheck: true
});

redis.on('connect', () => {
  console.log('[Redis] Connected successfully to', redisUrl);
});

redis.on('error', (err) => {
  console.error('[Redis] Connection error:', err);
  console.error('[Redis] Attempted to connect to:', redisUrl);
});

redis.on('ready', () => {
  console.log('[Redis] Client is ready');
});

module.exports = redis;