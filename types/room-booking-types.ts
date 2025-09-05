// --- CORRECTED Interfaces to match server data types ---
export interface Property {
  id: string;
  displayName: string;
  slug: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  cancellationHours: number | null;
  primaryCurrency: string | null;
  location: string;
  description: string | null;
}

export interface RoomType {
  id: string;
  displayName: string;
  maxOccupancy: number;
  maxAdults: number;
  maxChildren: number;
  baseRate: number;
  description: string | null;
  amenities?: string[];
  size?: string;
  images?: string[];
  features?: {
    hasBalcony?: boolean;
    hasOceanView?: boolean;
    hasPoolView?: boolean;
    hasKitchenette?: boolean;
    hasLivingArea?: boolean;
    petFriendly?: boolean;
    isAccessible?: boolean;
    smokingAllowed?: boolean;
  };
  bedConfiguration: string | null;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  specialRequests: string;
  guestNotes: string;
}

export interface PricingBreakdown {
  subtotal: number;
  nights: number;
  taxes: number;
  serviceFee: number;
  totalAmount: number;
}

export interface PaymentModalState {
  isOpen: boolean;
  status: 'checking' | 'paid' | 'failed' | 'cancelled' | 'pending';
  confirmationNumber?: string;
  sessionId?: string;
}

export interface RoomBookingClientProps {
  property: Property;
  roomType: RoomType;
}

export interface PaymentStatusResponse {
  status: 'paid' | 'pending' | 'failed' | 'cancelled';
  reservationId?: string;
  confirmationNumber?: string;
  message?: string;
  paymentDetails?: {
    amount: number;
    currency: string;
    method: string;
    provider: string;
    processedAt?: string;
  };
}