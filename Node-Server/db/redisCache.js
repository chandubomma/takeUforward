import { createClient } from 'redis';
import { REDIS_URL } from '../config/index.js';

const client = await createClient({
    url : REDIS_URL
})
  .on('error', err => console.log('Redis Client Error', err))
  .connect();


export const checkCacheAndGet = async (key) => {
  try {
   const cachedData = await client.get(key);
   if (cachedData) {
        console.log('Cache HIT!');
        return JSON.parse(cachedData);
    } else {
        console.log('Cache Miss!');
        return null;
    }
  } catch (error) {
    console.error('Error checking cache:', error);
    throw error;
  }
};

export const setCache = async (key, data, expiration = 3600) => {
  try {
    const multi = client.multi();
    multi.set(key, JSON.stringify(data));
    multi.expire(key, expiration);
    await multi.exec();
    console.log('Data set in cache');
  } catch (error) {
    console.error('Error setting cache:', error);
    throw error;
  }
};


export const clearCache = async (key) => {
    try {
      const deletedCount = await client.del(key);
      console.log(`Cache cleared for key: ${key}`);
      return deletedCount;
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  };
  