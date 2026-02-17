export type QrScanStatus = 'confirmed' | 'cancelled' | 'pending' | string;

export type EventBooking = {
  id: string;
  bookingNumber: string;
  status: QrScanStatus;
  totalAmount: string;
  currency: string;
  bookingItems?: Array<{
    id: string;
    quantity: number;
    price: string;
    totalPrice: string;
  }>;
  user?: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } | null;
  showInstance?: {
    showDateTime?: string;
    hall?: {
      name?: string;
    } | null;
    event?: {
      name?: string;
    } | null;
  } | null;
  section?: {
    name?: string;
  } | null;
};

export type RestaurantBooking = {
  id: string;
  restaurantId: string;
  userId: string;
  bookingDate: string;
  slotType: string;
  slotTime: string;
  bookingTimeInUTC: string;
  timezone: string;
  numberOfPeople: number;
  status: QrScanStatus;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
};

export type QrScanResponse = {
  success: boolean;
  message: string;
  data: {
    qrCode: {
      id: string;
      isScanned: boolean;
      scannedAt: string | null;
    };
    booking: EventBooking | RestaurantBooking;
    bookingType: string;
    isValid: boolean;
    isExpired: boolean;
  };
  meta?: {
    timestamp?: string;
  };
};
