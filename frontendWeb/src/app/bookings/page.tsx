'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { bookingsApi, hotelsApi, roomsApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Plus, Calendar, User, DollarSign } from 'lucide-react';

export default function BookingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', statusFilter],
    queryFn: () => bookingsApi.getAll(statusFilter || undefined).then((res) => res.data),
    enabled: isAuthenticated,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      bookingsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      <div className="mb-6">
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm max-w-xs"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

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
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold">{booking.hotel?.name}</h3>
                      <Badge
                        variant={
                          booking.status === 'CONFIRMED'
                            ? 'success'
                            : booking.status === 'PENDING'
                            ? 'warning'
                            : 'destructive'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {booking.user?.name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(booking.checkIn).toLocaleDateString()} -{' '}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        Room: {booking.room?.roomType} (Capacity: {booking.room?.capacity})
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${booking.totalPrice}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user?.role === 'ADMIN' && (
                      <>
                        {booking.status === 'PENDING' && (
                          <Button
                            size="sm"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: booking.id,
                                status: 'CONFIRMED',
                              })
                            }
                            disabled={updateStatusMutation.isPending}
                          >
                            Confirm
                          </Button>
                        )}
                        {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: booking.id,
                                status: 'CANCELLED',
                              })
                            }
                            disabled={updateStatusMutation.isPending}
                          >
                            Cancel
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
        <div className="text-center py-12">
          <p className="text-muted-foreground">No bookings found</p>
        </div>
      )}

      {showCreateModal && (
        <CreateBookingModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function CreateBookingModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hotelId: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    guestCount: 1,
  });

  const { data: hotels } = useQuery({
    queryKey: ['hotels-list'],
    queryFn: () => hotelsApi.getAll({ limit: 100 }).then((res) => res.data.data),
  });

  const { data: rooms } = useQuery({
    queryKey: ['rooms-by-hotel', formData.hotelId],
    queryFn: () => roomsApi.getAll(formData.hotelId).then((res) => res.data),
    enabled: !!formData.hotelId,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => bookingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
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
          <CardTitle>Create New Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Hotel</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.hotelId}
                onChange={(e) => setFormData({ ...formData, hotelId: e.target.value, roomId: '' })}
                required
              >
                <option value="">Select a hotel</option>
                {hotels?.map((hotel: any) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} - {hotel.city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Room</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                required
                disabled={!formData.hotelId}
              >
                <option value="">Select a room</option>
                {rooms?.map((room: any) => (
                  <option key={room.id} value={room.id}>
                    {room.roomType} - ${room.pricePerNight}/night ({room.availableRoomsCount} available)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Check In</label>
              <Input
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Check Out</label>
              <Input
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Guest Count</label>
              <Input
                type="number"
                min="1"
                value={formData.guestCount}
                onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Booking'}
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