"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { roomsApi } from "@/lib/api";
import { Plus, Users, DollarSign, DoorOpen, Pencil } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const createRoomSchema = z.object({
  hotelId: z.string().min(1, "hotelRequired"),
  roomType: z.string().min(2, "roomTypeMin"),
  capacity: z.number().min(1, "capacityMin"),
  pricePerNight: z.number().min(0, "priceMin"),
  availableRoomsCount: z.number().min(0, "availableMin"),
});

type CreateRoomForm = z.infer<typeof createRoomSchema>;

interface RoomsClientProps {
  initialRooms: any[];
  initialHotels: any[];
  user: any;
  t: Record<string, string>;
  locale: string;
}

export function RoomsClient({ initialRooms, initialHotels, user, t, locale }: RoomsClientProps) {
  const queryClient = useQueryClient();
  const [hotelFilter, setHotelFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const limit = 10;

  const { data: allRooms = initialRooms, isLoading } = useQuery({
    queryKey: ["rooms", hotelFilter],
    queryFn: async () => {
      const res = await roomsApi.getAll(hotelFilter || undefined);
      return Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
    },
    initialData: initialRooms,
  });

  const totalPages = Math.ceil(allRooms.length / limit);
  const currentRooms = allRooms.slice((page - 1) * limit, page * limit);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => roomsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t["rooms.title"]}</h1>
        {(user?.role === "ADMIN" || user?.role === "HOTEL_MANAGER") && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t["rooms.addRoom"]}
          </Button>
        )}
      </div>

      <div className="mb-6">
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={hotelFilter}
          onChange={(e) => setHotelFilter(e.target.value)}
        >
          <option value="">{t["rooms.allHotels"]}</option>
          {initialHotels.map((hotel: any) => (
            <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRooms.map((room: any) => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{room.roomType}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DoorOpen className="h-4 w-4 mr-2" />
                    {t["rooms.hotel"]}: {room.hotel?.name}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {t["rooms.capacity"]}: {room.capacity} {t["rooms.guests"]}
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span className="font-semibold">${room.pricePerNight}</span>
                    <span className="text-muted-foreground">{t["rooms.perNight"]}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <Badge variant={room.availableRoomsCount > 0 ? "success" : "destructive"}>
                      {room.availableRoomsCount} {t["rooms.available"]}
                    </Badge>
                    {(user?.role === "ADMIN" || user?.role === "HOTEL_MANAGER") && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingRoom(room)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(room.id)}
                          disabled={deleteMutation.isPending}
                        >
                          {t["rooms.delete"]}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            {t["pagination.previous"]}
          </Button>
          <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
          <Button variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            {t["pagination.next"]}
          </Button>
        </div>
      )}

      {(!allRooms || allRooms.length === 0) && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t["rooms.noRooms"]}</p>
        </div>
      )}

      {showCreateModal && (
        <RoomModal hotels={initialHotels} onClose={() => setShowCreateModal(false)} t={t} />
      )}

      {editingRoom && (
        <RoomModal room={editingRoom} hotels={initialHotels} onClose={() => setEditingRoom(null)} t={t} />
      )}
    </>
  );
}

function RoomModal({ room, hotels, onClose, t }: { room?: any; hotels: any[]; onClose: () => void; t: Record<string, string> }) {
  const queryClient = useQueryClient();
  const isEditing = !!room;

  const { register, handleSubmit, formState: { errors } } = useForm<CreateRoomForm>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      hotelId: room?.hotelId || room?.hotel?.id || "",
      roomType: room?.roomType || "",
      capacity: room?.capacity || 1,
      pricePerNight: room?.pricePerNight || 0,
      availableRoomsCount: room?.availableRoomsCount || 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateRoomForm) => isEditing ? roomsApi.update(room.id, data) : roomsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isEditing ? t["rooms.update.title"] : t["rooms.create.title"]}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <div className="space-y-2">
              <Label>{t["rooms.hotel"]}</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register("hotelId")}>
                <option value="">{t["rooms.selectHotel"]}</option>
                {hotels.map((hotel: any) => (<option key={hotel.id} value={hotel.id}>{hotel.name}</option>))}
              </select>
              {errors.hotelId && <p className="text-sm text-destructive">{errors.hotelId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t["rooms.roomType"]}</Label>
              <Input placeholder={t["rooms.roomTypePlaceholder"]} {...register("roomType")} />
              {errors.roomType && <p className="text-sm text-destructive">{errors.roomType.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t["rooms.capacity"]}</Label>
              <Input type="number" min="1" {...register("capacity", { valueAsNumber: true })} />
              {errors.capacity && <p className="text-sm text-destructive">{errors.capacity.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t["rooms.pricePerNight"]}</Label>
              <Input type="number" min="0" step="0.01" {...register("pricePerNight", { valueAsNumber: true })} />
              {errors.pricePerNight && <p className="text-sm text-destructive">{errors.pricePerNight.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t["rooms.availableRooms"]}</Label>
              <Input type="number" min="0" {...register("availableRoomsCount", { valueAsNumber: true })} />
              {errors.availableRoomsCount && <p className="text-sm text-destructive">{errors.availableRoomsCount.message}</p>}
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (isEditing ? t["rooms.updating"] : t["rooms.creating"]) : (isEditing ? t["rooms.update.save"] : t["rooms.create"])}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>{t["rooms.cancel"]}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}