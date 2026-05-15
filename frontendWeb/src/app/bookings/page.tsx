"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { bookingsApi, hotelsApi, roomsApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useI18n } from "@/components/I18nProvider";
import {
  Plus,
  Calendar,
  User,
  DollarSign,
  Building2,
  DoorOpen,
} from "lucide-react";

const createBookingSchema = z.object({
  hotelId: z.string().min(1, "hotelRequired"),
  roomId: z.string().min(1, "roomRequired"),
  checkIn: z.string().min(1, "checkInRequired"),
  checkOut: z.string().min(1, "checkOutRequired"),
  guestCount: z.number().min(1, "guestMin"),
});

type CreateBookingForm = z.infer<typeof createBookingSchema>;

export default function BookingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const { t } = useI18n();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const { data: bookings = [], isLoading } = useQuery<any[]>({
    queryKey: ["bookings", statusFilter],
    queryFn: async () => {
      const res = await bookingsApi.getAll(statusFilter || undefined);
      return res.data as any[];
    },
    enabled: isAuthenticated,
    initialData: [],
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "PENDING" | "CONFIRMED" | "CANCELLED";
    }) => bookingsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  if (!isAuthenticated) return null;

  const pendingCount =
    bookings?.filter((b: any) => b.status === "PENDING").length || 0;
  const confirmedCount =
    bookings?.filter((b: any) => b.status === "CONFIRMED").length || 0;
  const cancelledCount =
    bookings?.filter((b: any) => b.status === "CANCELLED").length || 0;

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t("bookings.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("bookings.subtitle")}</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("bookings.add")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-primary/5">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{bookings?.length || 0}</p>
            <p className="text-sm text-muted-foreground">
              {t("bookings.total")}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/5">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-sm text-muted-foreground">
              {t("bookings.pending")}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {confirmedCount}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("bookings.confirmed")}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/5">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{cancelledCount}</p>
            <p className="text-sm text-muted-foreground">
              {t("bookings.cancelled")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm max-w-xs"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">{t("bookings.allStatus")}</option>
          <option value="PENDING">{t("bookings.pending")}</option>
          <option value="CONFIRMED">{t("bookings.confirmed")}</option>
          <option value="CANCELLED">{t("bookings.cancelled")}</option>
        </select>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {bookings?.map((booking: any) => (
            <Card
              key={booking.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="space-y-3 w-full lg:w-auto">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <h3 className="text-lg font-semibold">
                          {booking.hotel?.name}
                        </h3>
                      </div>
                      <Badge
                        variant={
                          booking.status === "CONFIRMED"
                            ? "success"
                            : booking.status === "PENDING"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {t(`bookings.status.${booking.status.toLowerCase()}`)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <User className="h-4 w-4 mr-2" />
                        {booking.user?.name}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <DoorOpen className="h-4 w-4 mr-2" />
                        {booking.room?.roomType} ({t("dashboard.capacity")}:{" "}
                        {booking.room?.capacity})
                      </div>
                      <div className="flex items-center font-semibold">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {booking.totalPrice}
                      </div>
                    </div>
                    {booking.guestCount && (
                      <p className="text-sm text-muted-foreground">
                        {t("bookings.guestCount")}: {booking.guestCount}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 w-full lg:w-auto justify-end">
                    {user?.role === "ADMIN" && (
                      <>
                        {booking.status === "PENDING" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: booking.id,
                                status: "CONFIRMED",
                              })
                            }
                            disabled={updateStatusMutation.isPending}
                          >
                            {t("bookings.confirm")}
                          </Button>
                        )}
                        {(booking.status === "PENDING" ||
                          booking.status === "CONFIRMED") && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: booking.id,
                                status: "CANCELLED",
                              })
                            }
                            disabled={updateStatusMutation.isPending}
                          >
                            {t("bookings.cancel")}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(!bookings || bookings.length === 0) && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t("bookings.noBookings")}</p>
          </CardContent>
        </Card>
      )}

      {showCreateModal && (
        <CreateBookingModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function CreateBookingModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateBookingForm>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      hotelId: "",
      roomId: "",
      checkIn: "",
      checkOut: "",
      guestCount: 1,
    },
  });

  const selectedHotelId = watch("hotelId");


  const {
    data: hotels,
    isLoading: hotelsLoading,
  }: { data: any; isLoading: boolean } = useQuery({
    queryKey: ["hotels-list"],
    queryFn: () => {
      try {
        const res = hotelsApi
          .getAll({ limit: 100 })
          .then((res) => res.data) as any;

        const hotelsData = res?.data || [];
        return hotelsData;
      } catch (error) {
        console.error("Hotels API Error:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    initialData: [],
  });

  const { data: rooms, isLoading: roomsLoading } = useQuery<any[]>({
    queryKey: ["rooms-by-hotel", selectedHotelId],
    queryFn:  () => {
      if (!selectedHotelId) return [];
      try {
        const res =  roomsApi.getAll(selectedHotelId) as any;
        const roomsData = Array.isArray(res?.data) ? res.data : [];
        return roomsData;
      } catch (error) {
        console.error("Rooms API Error:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    initialData: [],
  });

  useEffect(() => {
    if (!selectedHotelId) {
      setValue("roomId", "");
    }
  }, [selectedHotelId, setValue]);

  const createMutation = useMutation({
    mutationFn: (data: CreateBookingForm) => bookingsApi.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      onClose();
    },
  });

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{t("bookings.create.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((data) => createMutation.mutate(data))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="hotelId">{t("hotels.title")}</Label>
              <select
                id="hotelId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register("hotelId")}
              >
                <option value="">
                  {hotelsLoading ? t("common.loading") : t("rooms.selectHotel")}
                </option>
                {hotels.length === 0 && !hotelsLoading && (
                  <option value="" disabled>
                    No hotels available
                  </option>
                )}
                {hotels.map((hotel: any) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} - {hotel.city}
                  </option>
                ))}
              </select>
              {errors.hotelId && (
                <p className="text-sm text-destructive">
                  {t(`validation.${errors.hotelId.message}`)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomId">{t("rooms.title")}</Label>
              <select
                id="roomId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register("roomId")}
                disabled={!selectedHotelId}
              >
                <option value="">
                  {!selectedHotelId
                    ? t("bookings.selectRoom")
                    : roomsLoading
                      ? t("common.loading")
                      : rooms.length === 0
                        ? "No rooms available"
                        : t("bookings.selectRoom")}
                </option>
                {rooms.map((room: any) => (
                  <option key={room.id} value={room.id}>
                    {room.roomType} - ${room.pricePerNight}
                    {t("rooms.perNight")} ({room.availableRoomsCount}{" "}
                    {t("rooms.available")})
                  </option>
                ))}
              </select>
              {errors.roomId && (
                <p className="text-sm text-destructive">
                  {t(`validation.${errors.roomId.message}`)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkIn">{t("dashboard.checkIn")}</Label>
              <Input
                id="checkIn"
                type="date"
                min={minDate}
                {...register("checkIn")}
              />
              {errors.checkIn && (
                <p className="text-sm text-destructive">
                  {t(`validation.${errors.checkIn.message}`)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOut">{t("dashboard.checkOut")}</Label>
              <Input
                id="checkOut"
                type="date"
                min={minDate}
                {...register("checkOut")}
              />
              {errors.checkOut && (
                <p className="text-sm text-destructive">
                  {t(`validation.${errors.checkOut.message}`)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestCount">{t("bookings.guestCount")}</Label>
              <Input
                id="guestCount"
                type="number"
                min="1"
                {...register("guestCount", { valueAsNumber: true })}
              />
              {errors.guestCount && (
                <p className="text-sm text-destructive">
                  {t(`validation.${errors.guestCount.message}`)}
                </p>
              )}
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending
                  ? t("bookings.creating")
                  : t("bookings.create.button")}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("rooms.cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
