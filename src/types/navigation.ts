export type Screen = 'Home' | 'Login' | 'BookingDetails';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  BookingDetails: {
    booking: {
      bookingId: string;
      showTitle: string;
      showTime: string;
      screen: string;
      seats: string[];
      customerName: string;
      status: 'VALID' | 'USED' | 'CANCELLED';
    };
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
