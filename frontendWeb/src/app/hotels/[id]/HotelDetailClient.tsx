"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roomsApi, bookingsApi } from "@/lib/api";
import { MapPin, Star, Users, DollarSign, DoorOpen, ArrowLeft, Calendar } from "lucide-react";

const bookingSchema = z.object({
  checkIn: z.string().min(1, "checkInRequired"),
  checkOut: z.string().min(1, "checkOutRequired"),
  guestCount: z.number().min(1, "guestMin"),
});

type BookingForm = z.infer<typeof bookingSchema>;

interface HotelDetailClientProps {
  hotel: any;
  rooms: any[];
  hotelId: string;
  user: any;
  t: Record<string, string>;
  locale: string;
}

export function HotelDetailClient({ hotel, rooms: initialRooms, hotelId, user, t, locale }: HotelDetailClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const { data: rooms = [] } = useQuery<any[]>({
    queryKey: ["rooms", hotelId],
    queryFn: async () => {
      const res = await roomsApi.getAll(hotelId);
      return Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
    },
    initialData: initialRooms,
  });

  const availableRooms = (rooms || []).filter((r: any) => r.availableRoomsCount > 0);
  const minPrice = availableRooms.length > 0 ? Math.min(...availableRooms.map((r: any) => r.pricePerNight)) : 0;

  return (
    <>
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/hotels")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t["hotels.detail.backToHotels"]}
      </Button>

      <Card className="mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{hotel.name}</h1>
                <Badge variant={hotel.status === "ACTIVE" ? "success" : "secondary"}>
                  {hotel.status}
                </Badge>
              </div>
              <div className="flex items-center text-muted-foreground mb-3">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{hotel.city}, {hotel.address}</span>
              </div>
              <div className="flex items-center mb-3">
                {[...Array(hotel.stars)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {t["hotels.detail.startingFrom"]} ${minPrice}{t["rooms.perNight"]}
              </p>
            </div>
            {availableRooms.length > 0 && (
              <Button onClick={() => setShowBookingModal(true)} size="lg">
                <Calendar className="h-4 w-4 mr-2" />
                {t["hotels.detail.bookNow"]}
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{hotel._count?.bookings || 0}</p>
            <p className="text-sm text-muted-foreground">{t["hotels.detail.totalBookings"]}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{rooms.length}</p>
            <p className="text-sm text-muted-foreground">{t["hotels.detail.totalRooms"]}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{availableRooms.length}</p>
            <p className="text-sm text-muted-foreground">{t["hotels.detail.availableRoomsCount"]}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{hotel.stars}</p>
            <p className="text-sm text-muted-foreground">{t["hotels.stars"]}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t["hotels.detail.amenities"]}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "wifi", label: t["home.wifi"] },
              { icon: "utensils", label: t["home.restaurant"] },
              { icon: "car", label: t["home.parking"] },
              { icon: "users", label: t["home.concierge"] },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <DoorOpen className="h-5 w-5 text-primary" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t["hotels.detail.rooms"]}</h2>
          <span className="text-sm text-muted-foreground">
            {availableRooms.length} {t["rooms.available"].toLowerCase()}
          </span>
        </div>
        {rooms.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room: any) => (
              <Card key={room.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{room.roomType}</CardTitle>
                    <Badge variant={room.availableRoomsCount > 0 ? "success" : "destructive"}>
                      {room.availableRoomsCount} {t["rooms.available"]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      {t["hotels.detail.capacity"]}: {room.capacity} {t["rooms.guests"]}
                    </div>
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="font-semibold text-xl">${room.pricePerNight}</span>
                      <span className="text-muted-foreground">{t["rooms.perNight"]}</span>
                    </div>
                    {room.availableRoomsCount > 0 && (
                      <Button
                        className="w-full mt-2"
                        variant="outline"
                        onClick={() => {
                          setSelectedRoom(room);
                          setShowBookingModal(true);
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {t["hotels.detail.bookRoom"]}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <DoorOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t["hotels.detail.noRooms"]}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t["hotels.detail.location"]}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <MapPin className="h-6 w-6 text-primary mt-1" />
            <div>
              <p className="font-medium">{hotel.city}</p>
              <p className="text-muted-foreground">{hotel.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {showBookingModal && (
        <BookingModal
          room={selectedRoom}
          hotelId={hotelId}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedRoom(null);
          }}
          t={t}
        />
      )}
    </>
  );
}

function BookingModal({ room, hotelId, onClose, t }: { room?: any; hotelId: string; onClose: () => void; t: Record<string, string> }) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { checkIn: "", checkOut: "", guestCount: 1 },
  });

  const mutation = useMutation({
    mutationFn: (data: BookingForm) => {
      const bookingData = { hotelId, roomId: room?.id || "", checkIn: data.checkIn, checkOut: data.checkOut, guestCount: data.guestCount };
      return bookingsApi.create(bookingData as any);
    },
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
          <CardTitle>{t["bookings.create.title"]}</CardTitle>
          {room && (
            <p className="text-sm text-muted-foreground">
              {room.roomType} - ${room.pricePerNight}{t["rooms.perNight"]}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <div className="space-y-2">
              <Label>{t["dashboard.checkIn"]}</Label>
              <Input type="date" min={minDate} {...register("checkIn")} />
              {errors.checkIn && <p className="text-sm text-destructive">{errors.checkIn.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t["dashboard.checkOut"]}</Label>
              <Input type="date" min={minDate} {...register("checkOut")} />
              {errors.checkOut && <p className="text-sm text-destructive">{errors.checkOut.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t["bookings.guestCount"]}</Label>
              <Input type="number" min="1" max={room?.capacity || 10} {...register("guestCount", { valueAsNumber: true })} />
              {errors.guestCount && <p className="text-sm text-destructive">{errors.guestCount.message}</p>}
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? t["bookings.creating"] : t["bookings.create.button"]}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>{t["rooms.cancel"]}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}