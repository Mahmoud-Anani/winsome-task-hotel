"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { hotelsApi, roomsApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useI18n } from "@/components/I18nProvider";
import {
  MapPin,
  Star,
  Users,
  DollarSign,
  DoorOpen,
  ArrowLeft,
  Calendar,
} from "lucide-react";

export default function HotelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const { t } = useI18n();
  const hotelId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const { data: hotel, isLoading: hotelLoading } = useQuery({
    queryKey: ["hotel", hotelId],
    queryFn: () => hotelsApi.getById(hotelId).then((res) => res.data),
    enabled: !!hotelId && isAuthenticated,
  });

  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms", hotelId],
    queryFn: () => roomsApi.getAll(hotelId).then((res) => res.data),
    enabled: !!hotelId && isAuthenticated,
  });

  if (!isAuthenticated) return null;

  if (hotelLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">{t("hotels.detail.notFound")}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/hotels")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("hotels.detail.backToHotels")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push("/hotels")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t("hotels.detail.backToHotels")}
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{hotel.name}</CardTitle>
                <Badge
                  variant={hotel.status === "ACTIVE" ? "success" : "secondary"}
                >
                  {hotel.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>
                  {hotel.city}, {hotel.address}
                </span>
              </div>
              <div className="flex items-center">
                {[...Array(hotel.stars)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  {t("hotels.detail.bookings")}
                </p>
                <p className="text-2xl font-bold">
                  {hotel._count?.bookings || 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            {t("hotels.detail.rooms")}
          </h2>
          {roomsLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : rooms.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {rooms.map((room: any) => (
                <Card
                  key={room.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{room.roomType}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {t("hotels.detail.capacity")}: {room.capacity}
                      </div>
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span className="font-semibold">
                          ${room.pricePerNight}
                        </span>
                        <span className="text-muted-foreground">
                          {t("rooms.perNight")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <Badge
                          variant={
                            room.availableRoomsCount > 0
                              ? "success"
                              : "destructive"
                          }
                        >
                          {room.availableRoomsCount} {t("rooms.available")}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <DoorOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {t("hotels.detail.noRooms")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
