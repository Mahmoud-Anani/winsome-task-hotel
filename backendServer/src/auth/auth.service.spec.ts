import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };
  let jwtService: { sign: jest.Mock };
  let mailService: {
    sendWelcomeEmail: jest.Mock;
    sendLoginNotification: jest.Mock;
  };

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    jwtService = {
      sign: jest.fn().mockReturnValue("signed.jwt.token"),
    };
    mailService = {
      sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
      sendLoginNotification: jest.fn().mockResolvedValue(undefined),
    };

    service = new AuthService(
      prisma as unknown as PrismaService,
      jwtService as unknown as JwtService,
      mailService as unknown as MailService,
    );
  });

  it("registers a new user, hashes the password, and sends a welcome email", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockImplementation(async ({ data }) => ({
      id: "user-1",
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    }));

    const result = await service.register({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
      role: UserRole.HOTEL_MANAGER,
    });

    const createdPassword = prisma.user.create.mock.calls[0][0].data.password;

    expect(await bcrypt.compare("password123", createdPassword)).toBe(true);
    expect(createdPassword).not.toBe("password123");
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: "user-1",
      email: "alice@example.com",
      role: UserRole.HOTEL_MANAGER,
    });
    expect(mailService.sendWelcomeEmail).toHaveBeenCalledWith(
      "Alice",
      "alice@example.com",
      UserRole.HOTEL_MANAGER,
    );
    expect(result).toEqual({
      user: {
        id: "user-1",
        name: "Alice",
        email: "alice@example.com",
        role: UserRole.HOTEL_MANAGER,
      },
      token: "signed.jwt.token",
    });
  });

  it("rejects registration when the email already exists", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "existing-user" });

    await expect(
      service.register({
        name: "Alice",
        email: "alice@example.com",
        password: "password123",
        role: UserRole.HOTEL_MANAGER,
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(mailService.sendWelcomeEmail).not.toHaveBeenCalled();
  });

  it("logs a user in and sends a login notification", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      name: "Alice",
      email: "alice@example.com",
      password: await bcrypt.hash("password123", 10),
      role: UserRole.ADMIN,
    });

    const result = await service.login({
      email: "alice@example.com",
      password: "password123",
    });

    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: "user-1",
      email: "alice@example.com",
      role: UserRole.ADMIN,
    });
    expect(mailService.sendLoginNotification).toHaveBeenCalledWith(
      "Alice",
      "alice@example.com",
    );
    expect(result).toEqual({
      user: {
        id: "user-1",
        name: "Alice",
        email: "alice@example.com",
        role: UserRole.ADMIN,
      },
      token: "signed.jwt.token",
    });
  });

  it("rejects login when the password is invalid", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      name: "Alice",
      email: "alice@example.com",
      password: await bcrypt.hash("password123", 10),
      role: UserRole.ADMIN,
    });

    await expect(
      service.login({
        email: "alice@example.com",
        password: "wrong-password",
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(mailService.sendLoginNotification).not.toHaveBeenCalled();
  });

  it("returns a sanitized user from validateUser", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      name: "Alice",
      email: "alice@example.com",
      role: UserRole.ADMIN,
    });

    const result = await service.validateUser("user-1");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-1" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    expect(result).toEqual({
      id: "user-1",
      name: "Alice",
      email: "alice@example.com",
      role: UserRole.ADMIN,
    });
  });
});
