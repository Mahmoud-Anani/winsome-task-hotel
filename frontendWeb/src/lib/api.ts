import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { name: string; email: string; password: string; role: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

export const hotelsApi = {
  getAll: (params?: { search?: string; page?: number; limit?: number }) =>
    api.get('/hotels', { params }),
  getById: (id: string) => api.get(`/hotels/${id}`),
  create: (data: { name: string; city: string; address: string; stars: number; status?: string }) =>
    api.post('/hotels', data),
  update: (id: string, data: Partial<{ name: string; city: string; address: string; stars: number; status: string }>) =>
    api.patch(`/hotels/${id}`, data),
  delete: (id: string) => api.delete(`/hotels/${id}`),
};

export const roomsApi = {
  getAll: (hotelId?: string) => api.get('/rooms', { params: { hotelId } }),
  getById: (id: string) => api.get(`/rooms/${id}`),
  create: (data: { hotelId: string; roomType: string; capacity: number; pricePerNight: number; availableRoomsCount: number }) =>
    api.post('/rooms', data),
  update: (id: string, data: Partial<{ roomType: string; capacity: number; pricePerNight: number; availableRoomsCount: number }>) =>
    api.patch(`/rooms/${id}`, data),
  delete: (id: string) => api.delete(`/rooms/${id}`),
};

export const bookingsApi = {
  getAll: (status?: string) => api.get('/bookings', { params: { status } }),
  getById: (id: string) => api.get(`/bookings/${id}`),
  create: (data: { hotelId: string; roomId: string; checkIn: string; checkOut: string; guestCount: number }) =>
    api.post('/bookings', data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/bookings/${id}/status`, { status }),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};