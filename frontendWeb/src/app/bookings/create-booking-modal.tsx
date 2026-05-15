"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/components/I18nProvider";

const createBookingSchema = z.object({
  hotelId: z.string().min(1, "hotelRequired"),
  roomId: z.string().min(1, "roomRequired"),
  checkIn: z.string().min(1, "checkInRequired"),
  checkOut: z.string().min(1, "checkOutRequired"),
  guestCount: z.number().min(1, "guestMin"),
});

type CreateBookingForm = z.infer<typeof createBookingSchema>;

function getApiBaseUrl() {
  if (typeof window === "undefined") return "";
  return process.env.NEXT_PUBLIC_API_URL || window.location.origin;
}

export function CreateBookingModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [hotels, setHotels] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [hotelsError, setHotelsError] = useState<string | null>(null);
  const [roomsError, setRoomsError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
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
  const apiUrl = getApiBaseUrl();

  useEffect(() => {
    const fetchHotels = async () => {
      setHotelsLoading(true);
      setHotelsError(null);

      try {
        console.log(
          "CreateBookingModal: fetching hotels from",
          `${apiUrl}/hotels?limit=100`,
        );
        const response = await fetch(`${apiUrl}/hotels?limit=100`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          const body = await response.text();
          throw new Error(`Hotels fetch failed: ${response.status} ${body}`);
        }

        const data = await response.json();
        console.log("CreateBookingModal: hotels json", data);
        setHotels(Array.isArray(data) ? data : data?.data || []);
      } catch (error: any) {
        console.error("CreateBookingModal: hotels fetch error", error);
        setHotelsError(error?.message || "Failed to load hotels");
        setHotels([]);
      } finally {
        setHotelsLoading(false);
      }
    };

    fetchHotels();
  }, [apiUrl]);

  useEffect(() => {
    if (!selectedHotelId) {
      setRooms([]);
      setValue("roomId", "");
      return;
    }

    const fetchRooms = async () => {
      setRoomsLoading(true);
      setRoomsError(null);

      try {
        console.log(
          "CreateBookingModal: fetching rooms from",
          `${apiUrl}/rooms?hotelId=${selectedHotelId}`,
        );
        const response = await fetch(
          `${apiUrl}/rooms?hotelId=${selectedHotelId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );

        if (!response.ok) {
          const body = await response.text();
          throw new Error(`Rooms fetch failed: ${response.status} ${body}`);
        }

        const data = await response.json();
        console.log("CreateBookingModal: rooms json", data);
        setRooms(Array.isArray(data) ? data : data?.data || []);
      } catch (error: any) {
        console.error("CreateBookingModal: rooms fetch error", error);
        setRoomsError(error?.message || "Failed to load rooms");
        setRooms([]);
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchRooms();
  }, [apiUrl, selectedHotelId, setValue]);

  const onSubmit = async (formData: CreateBookingForm) => {
    setSubmitLoading(true);
    setSubmitError(null);

    try {
      console.log("CreateBookingModal: creating booking", formData);
      const response = await fetch(`${apiUrl}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Booking create failed: ${response.status} ${body}`);
      }

      await response.json();
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      onClose();
    } catch (error: any) {
      console.error("CreateBookingModal: booking create error", error);
      setSubmitError(error?.message || "Failed to create booking");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{t("bookings.create.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                {!hotelsLoading && hotels.length === 0 && (
                  <option value="" disabled>
                    {hotelsError ? hotelsError : "No hotels available"}
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
                disabled={!selectedHotelId || roomsLoading}
              >
                <option value="">
                  {!selectedHotelId
                    ? t("bookings.selectRoom")
                    : roomsLoading
                      ? t("common.loading")
                      : rooms.length === 0
                        ? roomsError || "No rooms available"
                        : t("bookings.selectRoom")}
                </option>
                {rooms.map((room: any) => (
                  <option key={room.id} value={room.id}>
                    {room.roomType} - ${room.pricePerNight}{" "}
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
                min={new Date().toISOString().split("T")[0]}
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
                min={new Date().toISOString().split("T")[0]}
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

            {submitError && (
              <div>
                <p className="text-sm text-destructive">
                  {t("bookings.create.error")}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={submitLoading}>
                {submitLoading
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
