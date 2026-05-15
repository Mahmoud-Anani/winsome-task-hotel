"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { bookingsApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useI18n } from "@/components/I18nProvider";
import {
  Plus,
  Calendar,
  User,
  DollarSign,
  Building2,
  DoorOpen,
} from "lucide-react";
import { CreateBookingModal } from "./create-booking-modal";

export default function BookingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const { t } = useI18n();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const {
    data: allBookings = [],
    isLoading,
    refetch,
  } = useQuery<any[]>({
    queryKey: ["bookings", statusFilter],
    queryFn: async () => {
      const res = (await bookingsApi.getAll(statusFilter || undefined)) as any;
      return res.data || [];
    },
    enabled: true,
  });

  const totalPages = Math.ceil(allBookings.length / limit);
  const currentBookings = allBookings.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "PENDING" | "CONFIRMED" | "CANCELLED";
    }) => bookingsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const payMutation = useMutation({
    mutationFn: (id: string) => bookingsApi.pay(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  if (!isAuthenticated) return null;

  const pendingCount =
    allBookings?.filter((b: any) => b.status === "PENDING").length || 0;
  const confirmedCount =
    allBookings?.filter((b: any) => b.status === "CONFIRMED").length || 0;
  const cancelledCount =
    allBookings?.filter((b: any) => b.status === "CANCELLED").length || 0;

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t("bookings.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("bookings.subtitle")}</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("bookings.add")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-primary/5">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{allBookings?.length || 0}</p>
            <p className="text-sm text-muted-foreground">
              {t("bookings.total")}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/5">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-sm text-muted-foreground">
              {t("bookings.pending")}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {confirmedCount}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("bookings.confirmed")}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/5">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{cancelledCount}</p>
            <p className="text-sm text-muted-foreground">
              {t("bookings.cancelled")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm max-w-xs"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">{t("bookings.allStatus")}</option>
          <option value="PENDING">{t("bookings.pending")}</option>
          <option value="CONFIRMED">{t("bookings.confirmed")}</option>
          <option value="CANCELLED">{t("bookings.cancelled")}</option>
        </select>
      </div>

      {/* Bookings List */}
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
          {currentBookings?.map((booking: any) => (
            <Card
              key={booking.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="space-y-3 w-full lg:w-auto">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <h3 className="text-lg font-semibold">
                          {booking.hotel?.name}
                        </h3>
                      </div>
                      <Badge
                        variant={
                          booking.status === "CONFIRMED"
                            ? "success"
                            : booking.status === "PENDING"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {t(`bookings.status.${booking.status.toLowerCase()}`)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <User className="h-4 w-4 mr-2" />
                        {booking.user?.name}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <DoorOpen className="h-4 w-4 mr-2" />
                        {booking.room?.roomType} ({t("dashboard.capacity")}:{" "}
                        {booking.room?.capacity})
                      </div>
                      <div className="flex items-center font-semibold">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {booking.totalPrice}
                      </div>
                    </div>
                    {booking.guestCount && (
                      <p className="text-sm text-muted-foreground">
                        {t("bookings.guestCount")}: {booking.guestCount}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 w-full lg:w-auto justify-end">
                    {booking.status === "PENDING" &&
                      (user?.role === "ADMIN" ||
                        booking.user?.id === user?.id) && (
                        <Button
                          size="sm"
                          onClick={() => payMutation.mutate(booking.id)}
                          disabled={payMutation.isPending}
                        >
                          {t("bookings.pay")}
                        </Button>
                      )}
                    {user?.role === "ADMIN" && (
                      <>
                        {booking.status === "PENDING" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: booking.id,
                                status: "CONFIRMED",
                              })
                            }
                            disabled={updateStatusMutation.isPending}
                          >
                            {t("bookings.confirm")}
                          </Button>
                        )}
                        {(booking.status === "PENDING" ||
                          booking.status === "CONFIRMED") && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: booking.id,
                                status: "CANCELLED",
                              })
                            }
                            disabled={updateStatusMutation.isPending}
                          >
                            {t("bookings.cancel")}
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            {t("pagination.previous")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            {t("pagination.next")}
          </Button>
        </div>
      )}

      {(!allBookings || allBookings.length === 0) && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t("bookings.noBookings")}</p>
          </CardContent>
        </Card>
      )}

      {showCreateModal && (
        <CreateBookingModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
