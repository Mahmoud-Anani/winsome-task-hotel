"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { hotelsApi } from "@/lib/api";
import { Plus, Search, Star, MapPin, Edit, Trash2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const createHotelSchema = z.object({
  name: z.string().min(2, "hotelNameMin"),
  city: z.string().min(2, "cityMin"),
  address: z.string().min(5, "addressMin"),
  stars: z.number().min(1).max(5, "starsRange"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type CreateHotelForm = z.infer<typeof createHotelSchema>;

interface HotelsClientProps {
  initialHotels: any[];
  user: any;
  t: Record<string, string>;
  locale: string;
}

export function HotelsClient({ initialHotels, user, t, locale }: HotelsClientProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<any>(null);

const { data: hotelsData, isLoading } = useQuery({
    queryKey: ["hotels", search],
    queryFn: async () => {
      const res = await hotelsApi.getAll({ search, limit: 100 });
      return (res as any)?.data || initialHotels;
    },
    initialData: { data: initialHotels },
  });

  const hotels = (hotelsData as any)?.data || initialHotels;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => hotelsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    },
  });

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t["hotels.title"]}</h1>
        {(user?.role === "ADMIN" || user?.role === "HOTEL_MANAGER") && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t["hotels.addHotel"]}
          </Button>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t["hotels.searchPlaceholder"]}
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel: any) => (
            <Card key={hotel.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{hotel.name}</CardTitle>
                  <Badge variant={hotel.status === "ACTIVE" ? "success" : "secondary"}>
                    {hotel.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {hotel.city}, {hotel.address}
                  </div>
                  <div className="flex items-center">
                    {[...Array(hotel.stars)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-sm text-muted-foreground">
                      {hotel._count?.bookings || 0} {t["hotels.bookings"]}
                    </span>
                    <div className="flex gap-2">
                      <Link href={`/hotels/${hotel.id}`} passHref>
                        <Button variant="outline" size="sm">
                          {t["hotels.view"]}
                        </Button>
                      </Link>
                      {(user?.role === "ADMIN" || user?.role === "HOTEL_MANAGER") && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => setEditingHotel(hotel)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteMutation.mutate(hotel.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(!hotels || hotels.length === 0) && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t["hotels.noHotels"]}</p>
        </div>
      )}

      {showCreateModal && (
        <HotelModal onClose={() => setShowCreateModal(false)} t={t} />
      )}

      {editingHotel && (
        <HotelModal hotel={editingHotel} onClose={() => setEditingHotel(null)} t={t} />
      )}
    </>
  );
}

function HotelModal({ hotel, onClose, t }: { hotel?: any; onClose: () => void; t: Record<string, string> }) {
  const queryClient = useQueryClient();
  const isEditing = !!hotel;

  const { register, handleSubmit, formState: { errors } } = useForm<CreateHotelForm>({
    resolver: zodResolver(createHotelSchema),
    defaultValues: {
      name: hotel?.name || "",
      city: hotel?.city || "",
      address: hotel?.address || "",
      stars: hotel?.stars || 3,
      status: hotel?.status || "ACTIVE",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateHotelForm) => 
      isEditing ? hotelsApi.update(hotel.id, data) : hotelsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isEditing ? t["hotels.update.title"] : t["hotels.create.title"]}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <div className="space-y-2">
              <Label>{t["hotels.name"]}</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t["hotels.city"]}</Label>
              <Input {...register("city")} />
              {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t["hotels.address"]}</Label>
              <Input {...register("address")} />
              {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t["hotels.stars"]}</Label>
              <Input type="number" min="1" max="5" {...register("stars", { valueAsNumber: true })} />
              {errors.stars && <p className="text-sm text-destructive">{errors.stars.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t["hotels.status"]}</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register("status")}>
                <option value="ACTIVE">{t["hotels.active"]}</option>
                <option value="INACTIVE">{t["hotels.inactive"]}</option>
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (isEditing ? t["hotels.updating"] : t["hotels.creating"]) : (isEditing ? t["hotels.update.save"] : t["hotels.create"])}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>{t["hotels.cancel"]}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}