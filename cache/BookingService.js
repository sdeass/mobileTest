// 模拟从API获取数据的Service层
import bookingData from '../booking.json';

/**
 * BookingService 负责从API或本地mock获取booking数据
 */
export class BookingService {
  /**
   * 获取booking数据
   * 模拟网络请求延迟
   */
  static async fetchBookingData() {
    return new Promise((resolve, reject) => {
      // 模拟网络请求延迟
      setTimeout(() => {
        try {
          // 检查数据是否有效
          if (!bookingData || !bookingData.segments) {
            throw new Error('Invalid booking data format');
          }
          
          // 模拟数据有时效性 - 在实际应用中，这部分逻辑应该在API返回中处理
          const dataWithTimestamp = {
            ...bookingData,
            // 添加获取时间戳
            fetchTimestamp: Date.now(),
            // 计算过期时间（从现在开始30分钟）
            expiryTimestamp: Date.now() + 30 * 60 * 1000
          };
          
          resolve(dataWithTimestamp);
        } catch (error) {
          reject(new Error(`Failed to fetch booking data: ${error.message}`));
        }
      }, 1000); // 模拟1秒的网络延迟
    });
  }

  /**
   * 刷新booking数据
   * 与fetchBookingData相同，但可以在未来添加特定的刷新逻辑
   */
  static async refreshBookingData() {
    return this.fetchBookingData();
  }

  /**
   * 检查数据是否过期
   * @param {Object} data - 包含fetchTimestamp和expiryTimestamp的数据对象
   * @returns {boolean} - 数据是否已过期
   */
  static isDataExpired(data) {
    if (!data || !data.expiryTimestamp) {
      return true;
    }
    return Date.now() > data.expiryTimestamp;
  }
}