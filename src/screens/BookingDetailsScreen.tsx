import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type BookingDetailsProps = StackScreenProps<RootStackParamList, 'BookingDetails'>;

const BookingDetailsScreen: React.FC<BookingDetailsProps> = ({ route, navigation }) => {
  const { booking } = route.params;

  const statusColors = useMemo(() => {
    if (booking.status === 'VALID') {
      return { text: '#4ade80', bg: 'rgba(34, 197, 94, 0.18)', border: 'rgba(34, 197, 94, 0.5)' };
    }
    if (booking.status === 'USED') {
      return { text: '#fbbf24', bg: 'rgba(234, 179, 8, 0.18)', border: 'rgba(234, 179, 8, 0.5)' };
    }
    return { text: '#f87171', bg: 'rgba(248, 113, 113, 0.2)', border: 'rgba(248, 113, 113, 0.45)' };
  }, [booking.status]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#0f0f0f' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 pb-12">
          <View className="rounded-[28px] border border-white/10 bg-[#141414] p-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-lg font-semibold">
                Booking Details
              </Text>
              <View
                className="rounded-full px-3 py-1 border"
                style={{
                  backgroundColor: statusColors.bg,
                  borderColor: statusColors.border,
                }}
              >
                <Text className="text-xs font-semibold" style={{ color: statusColors.text }}>
                  {booking.status}
                </Text>
              </View>
            </View>

            <Text className="text-white text-2xl font-bold mb-2">
              {booking.showTitle}
            </Text>
            <Text className="text-slate-300 text-sm mb-4">
              {booking.showTime} · {booking.screen}
            </Text>

            <View className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-4 mb-4">
              <View className="flex-row justify-between mb-3">
                <Text className="text-slate-400 text-sm">Booking ID</Text>
                <Text className="text-white text-sm font-semibold">{booking.bookingId}</Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-slate-400 text-sm">Customer</Text>
                <Text className="text-white text-sm font-semibold">{booking.customerName}</Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-slate-400 text-sm">Seats</Text>
                <Text className="text-white text-sm font-semibold">
                  {booking.seats.join(', ')}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-slate-400 text-sm">Status</Text>
                <Text className="text-white text-sm font-semibold">{booking.status}</Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-4">
              <TouchableOpacity
                activeOpacity={0.85}
                className="flex-1 rounded-2xl px-4 py-3 mr-3 border border-white/10"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
              >
                <Text className="text-slate-100 text-center text-sm font-semibold">
                  Mark As Used
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                className="flex-1 rounded-2xl px-4 py-3"
                style={{ backgroundColor: '#f5b301' }}
              >
                <Text className="text-[#141414] text-center text-sm font-semibold">
                  Approve Entry
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.replace('Home')}
              activeOpacity={0.85}
              className="rounded-2xl px-4 py-3 border border-white/10"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
            >
              <Text className="text-slate-100 text-center text-sm font-semibold">
                Scan Another
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingDetailsScreen;
