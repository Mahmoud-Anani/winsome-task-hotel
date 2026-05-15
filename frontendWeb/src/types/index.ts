export type UserRole = 'ADMIN' | 'HOTEL_MANAGER';
export type HotelStatus = 'ACTIVE' | 'INACTIVE';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  stars: number;
  status: HotelStatus;
  createdBy: string;
  createdAt: string;
  rooms?: Room[];
  _count?: { bookings: number };
}

export interface Room {
  id: string;
  hotelId: string;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  availableRoomsCount: number;
  createdAt: string;
  hotel?: {
    id: string;
    name: string;
    city: string;
    address?: string;
  };
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  user?: { id: string; name: string; email: string };
  hotel?: { id: string; name: string; city: string; address: string };
  room?: { id: string; roomType: string; capacity: number };
}

export interface DashboardStats {
  totalHotels: number;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  recentBookings: Booking[];
}

export interface AuthResponse {
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}