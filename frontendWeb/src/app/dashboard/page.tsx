'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboardApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useI18n } from '@/components/I18nProvider';
import { Building2, Calendar, CheckCircle, Clock, DollarSign, TrendingUp, Users, Bed } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { t, locale } = useI18n();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data: stats = null, isLoading, refetch } = useQuery<any>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        const response = await dashboardApi.getStats() as any;
        console.log("Dashboard stats response:", response);
        return response?.data || response || null;
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        return null;
      }
    },
    enabled: true,
  });

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  const bookingStatusData = [
    { name: t('dashboard.confirmed'), value: stats?.confirmedBookings || 0, color: '#22c55e' },
    { name: t('dashboard.pending'), value: stats?.pendingBookings || 0, color: '#eab308' },
    { name: t('bookings.cancelled'), value: stats?.cancelledBookings || 0, color: '#ef4444' },
  ];

  const revenueData = stats?.recentBookings?.map((booking: any, index: number) => ({
    name: `Booking ${index + 1}`,
    revenue: booking.totalPrice,
    hotel: booking.hotel?.name || 'Hotel',
  })) || [];

  const monthlyData = [
    { month: t('dashboard.jan'), bookings: 12, revenue: 2400 },
    { month: t('dashboard.feb'), bookings: 19, revenue: 3800 },
    { month: t('dashboard.mar'), bookings: 15, revenue: 3000 },
    { month: t('dashboard.apr'), bookings: 25, revenue: 5000 },
    { month: t('dashboard.may'), bookings: 32, revenue: 6400 },
    { month: t('dashboard.jun'), bookings: 28, revenue: 5600 },
  ];

  const COLORS = ['#22c55e', '#eab308', '#ef4444'];

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <h1 className="text-3xl font-bold mb-8">{t('dashboard.title')}</h1>

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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">{t('dashboard.totalHotels')}</CardTitle>
                <Building2 className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalHotels || 0}</div>
                <p className="text-xs opacity-80 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  Active properties
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">{t('dashboard.totalBookings')}</CardTitle>
                <Calendar className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalBookings || 0}</div>
                <p className="text-xs opacity-80 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  Total reservations
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">{t('dashboard.confirmed')}</CardTitle>
                <CheckCircle className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.confirmedBookings || 0}</div>
                <p className="text-xs opacity-80 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  Confirmed stays
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">{t('dashboard.pending')}</CardTitle>
                <Clock className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.pendingBookings || 0}</div>
                <p className="text-xs opacity-80 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  Awaiting confirmation
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-4 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">{t('dashboard.totalRevenue')}</CardTitle>
                <DollarSign className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  ${(stats?.totalRevenue || 0).toLocaleString()}
                </div>
                <p className="text-xs opacity-80 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  From confirmed bookings
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('dashboard.bookingStatus')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bookingStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {bookingStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('dashboard.monthlyOverview')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="bookings" fill="#8b5cf6" name={t('dashboard.bookings')} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="revenue" fill="#22c55e" name={t('dashboard.revenue')} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">{t('dashboard.revenueTrend')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name={t('dashboard.revenue')}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t('dashboard.recentBookings')}</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left text-sm font-medium">{t('dashboard.hotel')}</th>
                    <th className="p-4 text-left text-sm font-medium">{t('dashboard.guest')}</th>
                    <th className="p-4 text-left text-sm font-medium">{t('dashboard.checkIn')}</th>
                    <th className="p-4 text-left text-sm font-medium">{t('dashboard.checkOut')}</th>
                    <th className="p-4 text-left text-sm font-medium">{t('dashboard.total')}</th>
                    <th className="p-4 text-left text-sm font-medium">{t('dashboard.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentBookings?.map((booking: any) => (
                    <tr key={booking.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {booking.hotel?.name}
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {booking.user?.name}
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        {new Date(booking.checkIn).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                      </td>
                      <td className="p-4 text-sm">
                        {new Date(booking.checkOut).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                      </td>
                      <td className="p-4 text-sm font-semibold">${booking.totalPrice}</td>
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
                          {t(`bookings.status.${booking.status.toLowerCase()}`)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {(!stats?.recentBookings || stats.recentBookings.length === 0) && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>{t('dashboard.noBookings')}</p>
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