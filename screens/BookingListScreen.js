import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useBooking } from '../cache/BookingContext';

export default function BookingListScreen() {
  const [segments, setSegments] = useState([]);
  const { fetchBookingData, bookingData, isLoading, error } = useBooking();

  useEffect(() => {
    // 页面出现时调用数据提供者接口
    fetchBookingData().then(data => {
      // 将获取的数据设置到状态中，用于UI展示
      if (data && data.segments) {
        setSegments(data.segments);
      }
    });
  }, []);

  // 监听bookingData变化，自动更新列表
  useEffect(() => {
    if (bookingData && bookingData.segments) {
      setSegments(bookingData.segments);
    }
  }, [bookingData]);

  const renderItem = ({ item }) => {
    // 从数据中提取起终点信息 - 正确访问对象的属性
    const origin = item.originAndDestinationPair?.origin?.code || 'Unknown';
    const destination = item.originAndDestinationPair?.destination?.code || 'Unknown';
    const originCity = item.originAndDestinationPair?.originCity || '';
    const destinationCity = item.originAndDestinationPair?.destinationCity || '';

    return (
      <View style={styles.segmentItem}>
        <Text style={styles.segmentText}>Segment {item.id}</Text>
        <Text style={styles.routeText}>{origin} - {destination}</Text>
        {originCity && destinationCity && (
          <Text style={styles.cityText}>{originCity} - {destinationCity}</Text>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Loading booking data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load data: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={segments}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No booking segments found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    padding: 15,
  },
  segmentItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  segmentText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  routeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  cityText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
});