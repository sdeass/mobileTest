import React, { createContext, useContext, useState } from 'react';
import { bookingDataManager } from './BookingDataManager';

// 创建Context
const BookingContext = createContext();

// 创建Provider组件
export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 获取booking数据的方法
  const fetchBookingData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingDataManager.getBookingData();
      setBookingData(data);
      // 在console中打印数据
      console.log('Booking Data (from Provider):', data);
      return data;
    } catch (err) {
      setError(err);
      console.error('Failed to fetch booking data:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 刷新数据的方法
  const refreshData = async () => {
    return fetchBookingData();
  };

  const contextValue = {
    bookingData,
    isLoading,
    error,
    fetchBookingData,
    refreshData
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

// 创建自定义Hook，方便组件使用
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};