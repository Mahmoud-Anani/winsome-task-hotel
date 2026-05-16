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
  const queryClient = useQueryClient();
  const [hotels, setHotels] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateBookingForm>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: { hotelId: "", roomId: "", checkIn: "", checkOut: "", guestCount: 1 },
  });

  const selectedHotelId = watch("hotelId");
  const selectedRoomId = watch("roomId");
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const apiUrl = getApiBaseUrl();

  const estimatedNights = selectedRoom && checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const estimatedTotal = selectedRoom ? selectedRoom.pricePerNight * estimatedNights : 0;
  const showEstimate = selectedRoom && estimatedNights > 0;

  useEffect(() => {
    const fetchHotels = async () => {
      setHotelsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/hotels?limit=100`, { credentials: "include" });
        const data = await response.json();
        setHotels(Array.isArray(data) ? data : data?.data || []);
      } catch (error) {
        console.error("Hotels fetch error", error);
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
      try {
        const response = await fetch(`${apiUrl}/rooms?hotelId=${selectedHotelId}`, { credentials: "include" });
        const data = await response.json();
        setRooms(Array.isArray(data) ? data : data?.data || []);
      } catch (error) {
        console.error("Rooms fetch error", error);
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
      const response = await fetch(`${apiUrl}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Booking failed");
      const booking = await response.json();
      
      const paymentResponse = await fetch(`${apiUrl}/bookings/${booking.id}/pay`, {
        method: "POST",
        credentials: "include",
      });
      if (!paymentResponse.ok) throw new Error("Payment failed");
      
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      onClose();
    } catch (error: any) {
      setSubmitError(error?.message || "Failed to create booking");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Create New Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Hotel</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register("hotelId")}>
                <option value="">Select a hotel</option>
                {hotels.map((hotel: any) => (<option key={hotel.id} value={hotel.id}>{hotel.name} - {hotel.city}</option>))}
              </select>
              {errors.hotelId && <p className="text-sm text-destructive">{errors.hotelId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Room</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register("roomId")} disabled={!selectedHotelId || roomsLoading}>
                <option value="">Select a room</option>
                {rooms.map((room: any) => (<option key={room.id} value={room.id}>{room.roomType} - ${room.pricePerNight}</option>))}
              </select>
              {errors.roomId && <p className="text-sm text-destructive">{errors.roomId.message}</p>}
            </div>

            {showEstimate && (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">
                <p className="font-medium">Estimated: {estimatedNights} nights</p>
                <p className="text-lg font-semibold">${estimatedTotal.toFixed(2)}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Check In</Label>
              <Input type="date" min={new Date().toISOString().split("T")[0]} {...register("checkIn")} />
              {errors.checkIn && <p className="text-sm text-destructive">{errors.checkIn.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Check Out</Label>
              <Input type="date" min={new Date().toISOString().split("T")[0]} {...register("checkOut")} />
              {errors.checkOut && <p className="text-sm text-destructive">{errors.checkOut.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Guest Count</Label>
              <Input type="number" min="1" {...register("guestCount", { valueAsNumber: true })} />
              {errors.guestCount && <p className="text-sm text-destructive">{errors.guestCount.message}</p>}
            </div>

            {submitError && <p className="text-sm text-destructive">{submitError}</p>}

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={submitLoading}>{submitLoading ? "Creating..." : "Create Booking"}</Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}