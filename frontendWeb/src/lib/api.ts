import { createClient } from "@/client/client";
import {
  authControllerLogin,
  authControllerRegister,
  bookingsControllerCreate,
  bookingsControllerFindAll,
  bookingsControllerFindOne,
  bookingsControllerUpdateStatus,
  dashboardControllerGetStats,
  hotelsControllerCreate,
  hotelsControllerFindAll,
  hotelsControllerFindOne,
  hotelsControllerRemove,
  hotelsControllerUpdate,
  roomsControllerCreate,
  roomsControllerFindAll,
  roomsControllerFindOne,
  roomsControllerRemove,
  roomsControllerUpdate,
} from "@/client";
import type {
  CreateBookingDto,
  CreateHotelDto,
  CreateRoomDto,
  LoginDto,
  RegisterDto,
  UpdateBookingStatusDto,
  UpdateHotelDto,
  UpdateRoomDto,
} from "@/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const heyApiClient = createClient({
  baseUrl: API_URL,
  auth: () => {
    if (typeof window === "undefined") {
      return undefined;
    }
    return localStorage.getItem("token") ?? undefined;
  },
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = {
  register: (data: RegisterDto) =>
    authControllerRegister({ body: data, client: heyApiClient }),
  login: (data: LoginDto) =>
    authControllerLogin({ body: data, client: heyApiClient }),
};

export const hotelsApi = {
  getAll: (params?: { search?: string; page?: number; limit?: number }) =>
    hotelsControllerFindAll({ query: params, client: heyApiClient }),
  getById: (id: string) =>
    hotelsControllerFindOne({ path: { id }, client: heyApiClient }),
  create: (data: CreateHotelDto) =>
    hotelsControllerCreate({ body: data, client: heyApiClient }),
  update: (id: string, data: Partial<UpdateHotelDto>) =>
    hotelsControllerUpdate({ path: { id }, body: data, client: heyApiClient }),
  delete: (id: string) =>
    hotelsControllerRemove({ path: { id }, client: heyApiClient }),
};

export const roomsApi = {
  getAll: (hotelId?: string) =>
    roomsControllerFindAll({ query: { hotelId }, client: heyApiClient }),
  getById: (id: string) =>
    roomsControllerFindOne({ path: { id }, client: heyApiClient }),
  create: (data: CreateRoomDto) =>
    roomsControllerCreate({ body: data, client: heyApiClient }),
  update: (id: string, data: Partial<UpdateRoomDto>) =>
    roomsControllerUpdate({ path: { id }, body: data, client: heyApiClient }),
  delete: (id: string) =>
    roomsControllerRemove({ path: { id }, client: heyApiClient }),
};

export const bookingsApi = {
  getAll: (status?: string) =>
    bookingsControllerFindAll({ query: { status }, client: heyApiClient }),
  getById: (id: string) =>
    bookingsControllerFindOne({ path: { id }, client: heyApiClient }),
  create: (data: CreateBookingDto) =>
    bookingsControllerCreate({ body: data, client: heyApiClient }),
  updateStatus: (id: string, status: string) =>
    bookingsControllerUpdateStatus({
      path: { id },
      body: { status },
      client: heyApiClient,
    }),
};

export const dashboardApi = {
  getStats: () => dashboardControllerGetStats({ client: heyApiClient }),
};
