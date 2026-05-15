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
import type { User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const heyApiClient = createClient({
  baseUrl: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = {
  register: (data: RegisterDto) =>
    authControllerRegister({
      body: data,
      client: heyApiClient,
      credentials: "include",
    }),
  login: (data: LoginDto) =>
    authControllerLogin({
      body: data,
      client: heyApiClient,
      credentials: "include",
    }),
  logout: async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  },
  me: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    return response.json() as Promise<{ user: User }>;
  },
};

export const hotelsApi = {
  getAll: (params?: { search?: string; page?: number; limit?: number }) =>
    hotelsControllerFindAll({
      query: params,
      client: heyApiClient,
      credentials: "include",
    }),
  getById: (id: string) =>
    hotelsControllerFindOne({
      path: { id },
      client: heyApiClient,
      credentials: "include",
    }),
  create: (data: CreateHotelDto) =>
    hotelsControllerCreate({
      body: data,
      client: heyApiClient,
      credentials: "include",
    }),
  update: (id: string, data: Partial<UpdateHotelDto>) =>
    hotelsControllerUpdate({
      path: { id },
      body: data,
      client: heyApiClient,
      credentials: "include",
    }),
  delete: (id: string) =>
    hotelsControllerRemove({
      path: { id },
      client: heyApiClient,
      credentials: "include",
    }),
};

export const roomsApi = {
  getAll: (hotelId?: string) =>
    roomsControllerFindAll({
      query: { hotelId },
      client: heyApiClient,
      credentials: "include",
    }),
  getById: (id: string) =>
    roomsControllerFindOne({
      path: { id },
      client: heyApiClient,
      credentials: "include",
    }),
  create: (data: CreateRoomDto) =>
    roomsControllerCreate({
      body: data,
      client: heyApiClient,
      credentials: "include",
    }),
  update: (id: string, data: Partial<UpdateRoomDto>) =>
    roomsControllerUpdate({
      path: { id },
      body: data,
      client: heyApiClient,
      credentials: "include",
    }),
  delete: (id: string) =>
    roomsControllerRemove({
      path: { id },
      client: heyApiClient,
      credentials: "include",
    }),
};

export const bookingsApi = {
  getAll: (status?: string) =>
    bookingsControllerFindAll({
      query: { status },
      client: heyApiClient,
      credentials: "include",
    }),
  getById: (id: string) =>
    bookingsControllerFindOne({
      path: { id },
      client: heyApiClient,
      credentials: "include",
    }),
  create: (data: CreateBookingDto) =>
    bookingsControllerCreate({
      body: data,
      client: heyApiClient,
      credentials: "include",
    }),
  updateStatus: (id: string, status: UpdateBookingStatusDto["status"]) =>
    bookingsControllerUpdateStatus({
      path: { id },
      body: { status },
      client: heyApiClient,
      credentials: "include",
    }),
  pay: async (id: string) => {
    const response = await fetch(`${API_URL}/bookings/${id}/pay`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data?.message || `Payment simulation failed: ${response.status}`,
      );
    }

    return data;
  },
};

export const dashboardApi = {
  getStats: () =>
    dashboardControllerGetStats({
      client: heyApiClient,
      credentials: "include",
    }),
};
