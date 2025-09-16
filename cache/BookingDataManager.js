// 数据管理器，整合Service层和缓存层，提供统一接口
import { BookingService } from './BookingService';
import { CachingService } from './CachingService';

/**
 * BookingDataManager 作为数据提供者，整合Service层和缓存层
 * 处理数据的获取、缓存、刷新和时效性检查
 */
export class BookingDataManager {
  constructor() {
    // 存储当前数据状态
    this.currentBookingData = null;
    // 存储数据获取状态（避免重复请求）
    this.isFetching = false;
    // 数据更新监听器列表
    this.listeners = new Set();
  }

  /**
   * 获取booking数据
   * 优先从缓存获取，如果缓存不存在或已过期，则从service层获取
   * @returns {Promise<Object>} booking数据
   */
  async getBookingData() {
    try {
      // 首先尝试从本地缓存获取数据
      const cachedData = await CachingService.getBookingData();
      
      // 检查缓存数据是否有效且未过期
      if (cachedData && !BookingService.isDataExpired(cachedData)) {
        console.log('Using valid cached booking data');
        this.currentBookingData = cachedData;
        return cachedData;
      }
      
      // 如果缓存不存在或已过期，则从service层获取新数据
      console.log('Cache not available or expired, fetching new data from service');
      const freshData = await this.fetchFreshData();
      
      // 返回新获取的数据
      return freshData;
    } catch (error) {
      console.error('Error in getBookingData:', error);
      // 如果发生错误，但存在缓存数据（即使已过期），也返回缓存数据作为备用
      if (this.currentBookingData) {
        console.warn('Returning possibly stale cached data due to error');
        return this.currentBookingData;
      }
      // 如果没有任何数据可用，则抛出错误
      throw error;
    }
  }

  /**
   * 从service层获取新数据并更新缓存
   * @private
   * @returns {Promise<Object>} 新获取的booking数据
   */
  async fetchFreshData() {
    // 避免重复请求
    if (this.isFetching) {
      // 等待正在进行的请求完成
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.isFetching && this.currentBookingData) {
            clearInterval(checkInterval);
            resolve(this.currentBookingData);
          }
        }, 100);
      });
    }

    this.isFetching = true;
    
    try {
      // 从service层获取新数据
      const freshData = await BookingService.fetchBookingData();
      
      // 更新当前数据状态
      this.currentBookingData = freshData;
      
      // 保存新数据到缓存
      await CachingService.saveBookingData(freshData);
      
      // 通知所有监听器数据已更新
      this.notifyDataUpdated(freshData);
      
      return freshData;
    } catch (error) {
      console.error('Failed to fetch fresh booking data:', error);
      throw error;
    } finally {
      this.isFetching = false;
    }
  }

  /**
   * 刷新booking数据
   * 强制从service层获取新数据
   * @returns {Promise<Object>} 新获取的booking数据
   */
  async refreshBookingData() {
    try {
      // 清除现有缓存
      await CachingService.clearBookingDataCache();
      
      // 从service层获取新数据
      const freshData = await this.fetchFreshData();
      
      return freshData;
    } catch (error) {
      console.error('Failed to refresh booking data:', error);
      throw error;
    }
  }

  /**
   * 检查当前数据是否过期
   * @returns {boolean} 数据是否已过期
   */
  isDataExpired() {
    return !this.currentBookingData || BookingService.isDataExpired(this.currentBookingData);
  }

  /**
   * 添加数据更新监听器
   * @param {Function} listener - 数据更新时的回调函数
   */
  addDataListener(listener) {
    if (typeof listener === 'function') {
      this.listeners.add(listener);
      // 如果已有数据，立即通知新添加的监听器
      if (this.currentBookingData) {
        listener(this.currentBookingData);
      }
    }
  }

  /**
   * 移除数据更新监听器
   * @param {Function} listener - 要移除的监听器函数
   */
  removeDataListener(listener) {
    this.listeners.delete(listener);
  }

  /**
   * 通知所有监听器数据已更新
   * @private
   * @param {Object} updatedData - 更新后的数据
   */
  notifyDataUpdated(updatedData) {
    this.listeners.forEach(listener => {
      try {
        listener(updatedData);
      } catch (error) {
        console.error('Error in data listener:', error);
      }
    });
  }

  /**
   * 清除当前数据和缓存
   */
  async clearData() {
    try {
      this.currentBookingData = null;
      await CachingService.clearBookingDataCache();
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }
}

// 创建单例实例，便于全局访问
export const bookingDataManager = new BookingDataManager();