// 本地持久化缓存层
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * CachingService 负责管理数据的本地持久化存储
 */
export class CachingService {
  // 缓存键名常量
  static CACHE_KEYS = {
    BOOKING_DATA: 'booking_data'
  };

  /**
   * 保存数据到本地缓存
   * @param {string} key - 缓存键名
   * @param {any} data - 要缓存的数据
   * @returns {Promise<void>}
   */
  static async saveToCache(key, data) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      console.log(`Data saved to cache with key: ${key}`);
    } catch (error) {
      console.error(`Failed to save data to cache: ${error.message}`);
      throw new Error(`Cache save error: ${error.message}`);
    }
  }

  /**
   * 从本地缓存读取数据
   * @param {string} key - 缓存键名
   * @returns {Promise<any|null>} - 缓存的数据，如果不存在则返回null
   */
  static async getFromCache(key) {
    const jd = await AsyncStorage.getItem(key)
    try {
      if (jd) {
        console.log(`Data retrieved from cache with key: ${key}`);
        return JSON.parse(jd);
      }
      console.log(`No data found in cache for key: ${key}`);
      return null;
    } catch (error) {
      console.error(`Failed to retrieve data from cache: ${error.message}`);
      throw new Error(`Cache retrieval error: ${error.message}`);
    }
  }

  /**
   * 清除指定键名的缓存
   * @param {string} key - 缓存键名
   * @returns {Promise<void>}
   */
  static async clearCache(key) {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Cache cleared for key: ${key}`);
    } catch (error) {
      console.error(`Failed to clear cache: ${error.message}`);
      throw new Error(`Cache clear error: ${error.message}`);
    }
  }

  /**
   * 清除所有缓存
   * @returns {Promise<void>}
   */
  static async clearAllCache() {
    try {
      await AsyncStorage.clear();
      console.log('All cache cleared');
    } catch (error) {
      console.error(`Failed to clear all cache: ${error.message}`);
      throw new Error(`Clear all cache error: ${error.message}`);
    }
  }

  /**
   * 检查缓存是否存在
   * @param {string} key - 缓存键名
   * @returns {Promise<boolean>} - 缓存是否存在
   */
  static async isCacheExists(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to check cache existence: ${error.message}`);
      return false;
    }
  }

  /**
   * 保存booking数据到缓存
   * @param {Object} bookingData - booking数据
   * @returns {Promise<void>}
   */
  static async saveBookingData(bookingData) {
    return this.saveToCache(this.CACHE_KEYS.BOOKING_DATA, bookingData);
  }

  /**
   * 从缓存获取booking数据
   * @returns {Promise<Object|null>} - booking数据，如果不存在则返回null
   */
  static async getBookingData() {
    return this.getFromCache(this.CACHE_KEYS.BOOKING_DATA);
  }

  /**
   * 清除booking数据缓存
   * @returns {Promise<void>}
   */
  static async clearBookingDataCache() {
    return this.clearCache(this.CACHE_KEYS.BOOKING_DATA);
  }
}