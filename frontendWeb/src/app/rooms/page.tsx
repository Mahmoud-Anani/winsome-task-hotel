'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { roomsApi, hotelsApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useI18n } from '@/components/I18nProvider';
import { Plus, Users, DollarSign, DoorOpen } from 'lucide-react';

const createRoomSchema = z.object({
  hotelId: z.string().min(1, 'hotelRequired'),
  roomType: z.string().min(2, 'roomTypeMin'),
  capacity: z.number().min(1, 'capacityMin'),
  pricePerNight: z.number().min(0, 'priceMin'),
  availableRoomsCount: z.number().min(0, 'availableMin'),
});

type CreateRoomForm = z.infer<typeof createRoomSchema>;

export default function RoomsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const { t } = useI18n();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hotelFilter, setHotelFilter] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms', hotelFilter],
    queryFn: () => roomsApi.getAll(hotelFilter || undefined).then((res) => res.data),
    enabled: isAuthenticated,
  });

  const { data: hotels } = useQuery({
    queryKey: ['hotels'],
    queryFn: () => hotelsApi.getAll({ limit: 100 }).then((res) => res.data.data),
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => roomsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('rooms.title')}</h1>
        {(user?.role === 'ADMIN' || user?.role === 'HOTEL_MANAGER') && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('rooms.addRoom')}
          </Button>
        )}
      </div>

      <div className="mb-6">
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={hotelFilter}
          onChange={(e) => setHotelFilter(e.target.value)}
        >
          <option value="">{t('rooms.allHotels')}</option>
          {hotels?.map((hotel: any) => (
            <option key={hotel.id} value={hotel.id}>
              {hotel.name}
            </option>
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
          {rooms?.map((room: any) => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{room.roomType}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DoorOpen className="h-4 w-4 mr-2" />
                    {t('rooms.hotel')}: {room.hotel?.name}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {t('rooms.capacity')}: {room.capacity} {t('rooms.guests')}
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span className="font-semibold">${room.pricePerNight}</span>
                    <span className="text-muted-foreground">{t('rooms.perNight')}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <Badge variant={room.availableRoomsCount > 0 ? 'success' : 'destructive'}>
                      {room.availableRoomsCount} {t('rooms.available')}
                    </Badge>
                    {(user?.role === 'ADMIN' || user?.role === 'HOTEL_MANAGER') && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(room.id)}
                        disabled={deleteMutation.isPending}
                      >
                        {t('rooms.delete')}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(!rooms || rooms.length === 0) && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('rooms.noRooms')}</p>
        </div>
      )}

      {showCreateModal && (
        <CreateRoomModal
          hotels={hotels || []}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}

function CreateRoomModal({ hotels, onClose }: { hotels: any[]; onClose: () => void }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoomForm>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      hotelId: '',
      roomType: '',
      capacity: 1,
      pricePerNight: 0,
      availableRoomsCount: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateRoomForm) => roomsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('rooms.create.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hotelId">{t('rooms.hotel')}</Label>
              <select
                id="hotelId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('hotelId')}
              >
                <option value="">{t('rooms.selectHotel')}</option>
                {hotels.map((hotel: any) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
              {errors.hotelId && <p className="text-sm text-destructive">{t(`validation.${errors.hotelId.message}`)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomType">{t('rooms.roomType')}</Label>
              <Input
                id="roomType"
                placeholder={t('rooms.roomTypePlaceholder')}
                {...register('roomType')}
              />
              {errors.roomType && <p className="text-sm text-destructive">{t(`validation.${errors.roomType.message}`)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">{t('rooms.capacity')}</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                {...register('capacity', { valueAsNumber: true })}
              />
              {errors.capacity && <p className="text-sm text-destructive">{t(`validation.${errors.capacity.message}`)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerNight">{t('rooms.pricePerNight')}</Label>
              <Input
                id="pricePerNight"
                type="number"
                min="0"
                step="0.01"
                {...register('pricePerNight', { valueAsNumber: true })}
              />
              {errors.pricePerNight && <p className="text-sm text-destructive">{t(`validation.${errors.pricePerNight.message}`)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableRoomsCount">{t('rooms.availableRooms')}</Label>
              <Input
                id="availableRoomsCount"
                type="number"
                min="0"
                {...register('availableRoomsCount', { valueAsNumber: true })}
              />
              {errors.availableRoomsCount && <p className="text-sm text-destructive">{t(`validation.${errors.availableRoomsCount.message}`)}</p>}
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? t('rooms.creating') : t('rooms.create')}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                {t('rooms.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}