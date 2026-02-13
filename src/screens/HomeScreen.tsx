import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [qrId, setQrId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessingScan, setIsProcessingScan] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const mockFetchBooking = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    if (id.toLowerCase().startsWith('x')) {
      throw new Error('Ticket not found');
    }
    return {
      bookingId: `BK-${id.toUpperCase()}`,
      showTitle: 'Midnight Mirage',
      showTime: 'Today, 7:30 PM',
      screen: 'Screen 4 · Dolby',
      seats: ['F10', 'F11', 'F12'],
      customerName: 'Rahul Mehta',
      status: 'VALID' as const,
    };
  };

  const handleMockScan = async (overrideId?: string) => {
    const idToUse = (overrideId ?? qrId).trim();
    if (!idToUse) {
      setScanError('Please enter the QR code ID');
      return;
    }
    setIsScanning(true);
    setScanError(null);
    try {
      const data = await mockFetchBooking(idToUse);
      navigation.navigate('BookingDetails', { booking: data });
    } catch (error: any) {
      setScanError(error?.message || 'Unable to validate ticket');
    } finally {
      setIsScanning(false);
      setIsProcessingScan(false);
    }
  };

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (isProcessingScan || codes.length === 0) {
        return;
      }
      const value = codes[0]?.value;
      if (!value) {
        return;
      }
      setIsProcessingScan(true);
      setQrId(value);
      handleMockScan(value);
    },
  });

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#0f0f0f' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />

      <View className="flex-1">
        <View className="absolute inset-0">
          {device && hasPermission ? (
            <Camera
              style={{ height: '100%', width: '100%' }}
              device={device}
              isActive={true}
              codeScanner={codeScanner}
            />
          ) : (
            <View className="flex-1 items-center justify-center bg-[#141414]">
              <Text className="text-slate-200 text-sm">
                {hasPermission ? 'Camera not available' : 'Camera permission required'}
              </Text>
            </View>
          )}
          <View className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.35)' }} />
        </View>

        <View className="flex-1 justify-between px-6 pt-8 pb-10">
          <View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-slate-300 text-xs uppercase tracking-[0.3em]">
                DVIU CINEMA
              </Text>
              <View className="rounded-full bg-[#1f1f1f] px-3 py-1 border border-white/10">
                <Text className="text-[10px] uppercase tracking-[0.25em] text-[#f5b301]">
                  Live
                </Text>
              </View>
            </View>
            <Text className="text-white text-3xl font-bold">
              QR Check-In
            </Text>
            <Text className="text-slate-300 text-sm mt-2">
              Align the QR inside the frame to validate entry.
            </Text>
            {scanError ? (
              <Text className="text-xs text-red-400 mt-3">{scanError}</Text>
            ) : null}
          </View>

          <View className="items-center">
            <View className="w-64 h-64 rounded-[36px] border-4 border-[#f5b301] bg-transparent">
              <View className="absolute -top-1 -left-1 w-10 h-10 border-l-4 border-t-4 border-[#f5b301] rounded-tl-[20px]" />
              <View className="absolute -top-1 -right-1 w-10 h-10 border-r-4 border-t-4 border-[#f5b301] rounded-tr-[20px]" />
              <View className="absolute -bottom-1 -left-1 w-10 h-10 border-l-4 border-b-4 border-[#f5b301] rounded-bl-[20px]" />
              <View className="absolute -bottom-1 -right-1 w-10 h-10 border-r-4 border-b-4 border-[#f5b301] rounded-br-[20px]" />
              <View className="absolute left-6 right-6 top-1/2 h-[2px] bg-[#f5b301] opacity-90" />
            </View>
            <Text className="text-slate-200 text-sm mt-6">
              {isScanning ? 'Validating…' : 'Scanning…'}
            </Text>
          </View>

          <View className="items-center">
            <Text className="text-slate-400 text-xs">
              Keep the device steady for quick scan
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
