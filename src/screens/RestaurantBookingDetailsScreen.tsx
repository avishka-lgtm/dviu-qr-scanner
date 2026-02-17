import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { RestaurantBooking } from '../types/qrCode';

type RestaurantBookingDetailsProps = StackScreenProps<RootStackParamList, 'RestaurantBookingDetails'>;

const toReadableLabel = (value: string) => {
  return value
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const formatDate = (value?: string) => {
  if (!value) {
    return 'N/A';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (value?: string, timezone?: string) => {
  if (!value) {
    return 'N/A';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone || undefined,
  });
};

const RestaurantBookingDetailsScreen: React.FC<RestaurantBookingDetailsProps> = ({ route, navigation }) => {
  const { scanResult } = route.params;
  const { data } = scanResult;
  const booking = data.booking as RestaurantBooking;

  const statusLabel = data.isValid
    ? data.isExpired
      ? 'Expired'
      : toReadableLabel(booking.status)
    : 'Invalid';

  const statusColors = useMemo(() => {
    if (statusLabel.toLowerCase() === 'confirmed') {
      return { text: '#4ade80', bg: 'rgba(34, 197, 94, 0.18)', border: 'rgba(34, 197, 94, 0.5)' };
    }
    if (statusLabel.toLowerCase() === 'expired') {
      return { text: '#fbbf24', bg: 'rgba(234, 179, 8, 0.18)', border: 'rgba(234, 179, 8, 0.5)' };
    }
    return { text: '#f87171', bg: 'rgba(248, 113, 113, 0.2)', border: 'rgba(248, 113, 113, 0.45)' };
  }, [statusLabel]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#0f0f0f' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 pb-12">
          <View className="rounded-[28px] border border-white/10 bg-[#141414] p-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white text-xl font-semibold">Restaurant Check-in</Text>
              <View
                className="rounded-full px-3 py-1 border"
                style={{
                  backgroundColor: statusColors.bg,
                  borderColor: statusColors.border,
                }}
              >
                <Text className="text-xs font-semibold" style={{ color: statusColors.text }}>
                  {statusLabel}
                </Text>
              </View>
            </View>

            <Text className="text-slate-300 text-sm mb-5">
              {data.isValid && !data.isExpired ? 'Booking is valid for entry.' : 'Please verify this booking before allowing entry.'}
            </Text>

            <View className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-4 mb-4">
              <View className="flex-row justify-between mb-3">
                <Text className="text-slate-400 text-sm">Guest Name</Text>
                <Text className="text-white text-sm font-semibold">{booking.customerName ?? 'Guest'}</Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-slate-400 text-sm">Party Size</Text>
                <Text className="text-white text-sm font-semibold">{booking.numberOfPeople} people</Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-slate-400 text-sm">Booking Date</Text>
                <Text className="text-white text-sm font-semibold">{formatDate(booking.bookingDate)}</Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-slate-400 text-sm">Meal Slot</Text>
                <Text className="text-white text-sm font-semibold">{toReadableLabel(booking.slotType)}</Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-slate-400 text-sm">Booking Time</Text>
                <Text className="text-white text-sm font-semibold">{booking.slotTime}</Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-slate-400 text-sm">Contact</Text>
                <Text className="text-white text-sm font-semibold">{booking.customerEmail ?? booking.customerPhone ?? 'N/A'}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-slate-400 text-sm">Status</Text>
                <Text className="text-white text-sm font-semibold">{statusLabel}</Text>
              </View>
            </View>

            <View className="rounded-2xl border border-white/10 bg-[#171717] p-4 mb-5">
              <Text className="text-slate-300 text-sm font-semibold mb-2">Reference</Text>
              <Text className="text-slate-400 text-xs mb-1">Booking Ref: {booking.id}</Text>
              <Text className="text-slate-400 text-xs mb-1">Restaurant Ref: {booking.restaurantId}</Text>
              <Text className="text-slate-400 text-xs mb-1">QR Ref: {data.qrCode.id}</Text>
              <Text className="text-slate-400 text-xs">
                Scanned At: {formatDateTime(data.qrCode.scannedAt ?? undefined, booking.timezone)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.replace('Home')}
              activeOpacity={0.85}
              className="rounded-2xl px-4 py-3 border border-white/10"
              style={{ backgroundColor: '#f5b301' }}
            >
              <Text className="text-[#141414] text-center text-sm font-semibold">Scan Another</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RestaurantBookingDetailsScreen;
