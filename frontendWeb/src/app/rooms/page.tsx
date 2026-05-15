'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { roomsApi, hotelsApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Plus, Users, DollarSign, DoorOpen } from 'lucide-react';

export default function RoomsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
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
        <h1 className="text-3xl font-bold">Rooms</h1>
        {(user?.role === 'ADMIN' || user?.role === 'HOTEL_MANAGER') && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Button>
        )}
      </div>

      <div className="mb-6">
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={hotelFilter}
          onChange={(e) => setHotelFilter(e.target.value)}
        >
          <option value="">All Hotels</option>
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
                    Hotel: {room.hotel?.name}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    Capacity: {room.capacity} guests
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span className="font-semibold">${room.pricePerNight}</span>
                    <span className="text-muted-foreground">/night</span>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <Badge variant={room.availableRoomsCount > 0 ? 'success' : 'destructive'}>
                      {room.availableRoomsCount} available
                    </Badge>
                    {(user?.role === 'ADMIN' || user?.role === 'HOTEL_MANAGER') && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(room.id)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
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
          <p className="text-muted-foreground">No rooms found</p>
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
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hotelId: '',
    roomType: '',
    capacity: 1,
    pricePerNight: 0,
    availableRoomsCount: 1,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => roomsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add New Room</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Hotel</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.hotelId}
                onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
                required
              >
                <option value="">Select a hotel</option>
                {hotels.map((hotel: any) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Room Type</label>
              <Input
                placeholder="e.g., Deluxe Suite"
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Capacity</label>
              <Input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Price per Night</label>
              <Input
                type="number"
                min="0"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Available Rooms</label>
              <Input
                type="number"
                min="0"
                value={formData.availableRoomsCount}
                onChange={(e) => setFormData({ ...formData, availableRoomsCount: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}