import { QrScanResponse } from './qrCode';

export type Screen = 'Home' | 'Login' | 'BookingDetails';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  BookingDetails: {
    scanResult: QrScanResponse;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
