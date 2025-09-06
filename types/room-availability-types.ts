export interface DailyAvailability {
  date: string;
  availableRooms: number;
  totalRooms: number;
}

export interface RoomAvailabilityResponse {
  isAvailable: boolean;
  availableRooms: number;
  totalRooms: number;
  requestedDates: {
    checkIn: string;
    checkOut: string;
    nights: number;
  };
  dailyAvailability: DailyAvailability[];
  message: string;
}

export interface AvailabilityCalendarProps {
  businessUnitId: string;
  roomTypeId: string;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  label: string;
  minDate?: Date;
  maxDate?: Date;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export interface MonthlyAvailability {
  [dateString: string]: {
    availableRooms: number;
    totalRooms: number;
  };
}