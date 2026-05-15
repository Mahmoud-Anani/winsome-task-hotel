'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboardApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Building2, Calendar, CheckCircle, Clock, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data: stats = null, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        const response = await dashboardApi.getStats();
        return response.data;
      } catch {
        return null;
      }
    },
    enabled: isAuthenticated,
    initialData: null,
  });

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hotels</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalHotels || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.confirmedBookings || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingBookings || 0}</div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${(stats?.totalRevenue || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left text-sm font-medium">Hotel</th>
                    <th className="p-4 text-left text-sm font-medium">Guest</th>
                    <th className="p-4 text-left text-sm font-medium">Check In</th>
                    <th className="p-4 text-left text-sm font-medium">Check Out</th>
                    <th className="p-4 text-left text-sm font-medium">Total</th>
                    <th className="p-4 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentBookings?.map((booking: any) => (
                    <tr key={booking.id} className="border-b">
                      <td className="p-4 text-sm">{booking.hotel?.name}</td>
                      <td className="p-4 text-sm">{booking.user?.name}</td>
                      <td className="p-4 text-sm">
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm">
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm">${booking.totalPrice}</td>
                      <td className="p-4 text-sm">
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
                      </td>
                    </tr>
                  ))}
                  {(!stats?.recentBookings || stats.recentBookings.length === 0) && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        No recent bookings
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}