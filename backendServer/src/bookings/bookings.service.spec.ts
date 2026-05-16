import {
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { BookingStatus } from "@prisma/client";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma/prisma.service";
import { BookingsService } from "./bookings.service";

const futureDate = (daysFromNow: number) =>
  new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000).toISOString();

describe("BookingsService", () => {
  let service: BookingsService;
  let prisma: {
    room: {
      findUnique: jest.Mock;
    };
    booking: {
      findMany: jest.Mock;
      update: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let txBookingCreate: jest.Mock;
  let mailService: {
    sendBookingStatusUpdatedNotification: jest.Mock;
    sendPaymentConfirmation: jest.Mock;
  };

  beforeEach(() => {
    txBookingCreate = jest.fn();
    prisma = {
      room: {
        findUnique: jest.fn(),
      },
      booking: {
        findMany: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(async (callback) =>
        callback({
          booking: {
            create: txBookingCreate,
          },
        }),
      ),
    };
    mailService = {
      sendBookingStatusUpdatedNotification: jest.fn().mockResolvedValue(undefined),
      sendPaymentConfirmation: jest.fn().mockResolvedValue(undefined),
    };

    service = new BookingsService(
      prisma as unknown as PrismaService,
      mailService as unknown as MailService,
    );
  });

  it("rejects bookings when the room cannot be found", async () => {
    prisma.room.findUnique.mockResolvedValue(null);

    await expect(
      service.create(
        {
          hotelId: "hotel-1",
          roomId: "room-1",
          checkIn: futureDate(3),
          checkOut: futureDate(5),
          guestCount: 2,
        },
        "user-1",
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("rejects bookings when the requested guest count exceeds the room capacity", async () => {
    prisma.room.findUnique.mockResolvedValue({
      id: "room-1",
      capacity: 2,
      availableRoomsCount: 3,
      pricePerNight: 120,
    });

    await expect(
      service.create(
        {
          hotelId: "hotel-1",
          roomId: "room-1",
          checkIn: futureDate(3),
          checkOut: futureDate(5),
          guestCount: 4,
        },
        "user-1",
      ),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.booking.findMany).not.toHaveBeenCalled();
  });

  it("rejects bookings when all room inventory is already reserved for the selected dates", async () => {
    prisma.room.findUnique.mockResolvedValue({
      id: "room-1",
      capacity: 2,
      availableRoomsCount: 1,
      pricePerNight: 120,
    });
    prisma.booking.findMany.mockResolvedValue([{ id: "booking-1" }]);

    await expect(
      service.create(
        {
          hotelId: "hotel-1",
          roomId: "room-1",
          checkIn: futureDate(3),
          checkOut: futureDate(5),
          guestCount: 2,
        },
        "user-1",
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("creates a pending booking with the calculated total price", async () => {
    prisma.room.findUnique.mockResolvedValue({
      id: "room-1",
      capacity: 3,
      availableRoomsCount: 2,
      pricePerNight: 150,
    });
    prisma.booking.findMany.mockResolvedValue([]);
    txBookingCreate.mockImplementation(async ({ data }) => ({
      id: "booking-1",
      ...data,
    }));

    const result = await service.create(
      {
        hotelId: "hotel-1",
        roomId: "room-1",
        checkIn: futureDate(4),
        checkOut: futureDate(7),
        guestCount: 2,
      },
      "user-1",
    );

    expect(txBookingCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user-1",
        hotelId: "hotel-1",
        roomId: "room-1",
        guestCount: 2,
        totalPrice: 450,
        status: BookingStatus.PENDING,
      }),
    });
    expect(result).toEqual(
      expect.objectContaining({
        id: "booking-1",
        totalPrice: 450,
        status: BookingStatus.PENDING,
      }),
    );
  });

  it("confirms a pending booking during payment simulation and sends a confirmation email", async () => {
    const nowSpy = jest.spyOn(Date, "now").mockReturnValue(1700000000000);
    const booking = {
      id: "booking-12345678",
      userId: "user-1",
      totalPrice: 320,
      status: BookingStatus.PENDING,
      checkIn: new Date("2030-06-10T00:00:00.000Z"),
      checkOut: new Date("2030-06-12T00:00:00.000Z"),
      user: { name: "Alice", email: "alice@example.com" },
      hotel: { name: "Winsome Suites" },
      room: { roomType: "Deluxe" },
    };

    jest.spyOn(service, "findOne").mockResolvedValue(booking as never);
    prisma.booking.update.mockResolvedValue({
      id: booking.id,
      totalPrice: booking.totalPrice,
      status: BookingStatus.CONFIRMED,
    });

    const result = await service.simulatePayment(
      booking.id,
      "user-1",
      "HOTEL_MANAGER",
    );

    expect(prisma.booking.update).toHaveBeenCalledWith({
      where: { id: booking.id },
      data: { status: BookingStatus.CONFIRMED },
    });
    expect(mailService.sendPaymentConfirmation).toHaveBeenCalledWith({
      to: "alice@example.com",
      recipientName: "Alice",
      bookingId: booking.id,
      hotelName: "Winsome Suites",
      roomType: "Deluxe",
      totalPrice: 320,
      transactionId: "SIM-BOOKING--1700000000000",
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    });
    expect(result).toEqual({
      success: true,
      bookingId: booking.id,
      amount: 320,
      transactionId: "SIM-BOOKING--1700000000000",
      status: "SUCCESS",
      message: "Payment simulated successfully. Booking confirmed.",
    });

    nowSpy.mockRestore();
  });
});
