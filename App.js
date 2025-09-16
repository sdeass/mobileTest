import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import BookingListScreen from './screens/BookingListScreen';
import { BookingProvider } from './cache/BookingContext';

export default function App() {
  return (
    <BookingProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Booking Information</Text>
        <BookingListScreen />
        <StatusBar style="auto" />
      </View>
    </BookingProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});