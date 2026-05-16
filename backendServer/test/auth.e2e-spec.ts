import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { AuthController } from "../src/auth/auth.controller";
import { AuthService } from "../src/auth/auth.service";
import { JwtAuthGuard } from "../src/auth/guards/jwt-auth.guard";

const authenticatedUser = {
  id: "user-1",
  name: "Alice",
  email: "alice@example.com",
  role: "ADMIN",
};

class TestJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    request.user = authenticatedUser;
    return true;
  }
}

describe("AuthController (integration)", () => {
  let app: INestApplication;
  const authService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    authService.register.mockReset();
    authService.login.mockReset();

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(TestJwtAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("POST /auth/register returns the user payload and writes the auth cookie", async () => {
    authService.register.mockResolvedValue({
      user: authenticatedUser,
      token: "signed.jwt.token",
    });

    const response = await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        name: "Alice",
        email: "alice@example.com",
        password: "password123",
        role: "ADMIN",
      })
      .expect(201);

    expect(authService.register).toHaveBeenCalledWith({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
      role: "ADMIN",
    });
    expect(response.body).toEqual({ user: authenticatedUser });
    expect(response.headers["set-cookie"][0]).toContain(
      "Authentication=signed.jwt.token",
    );
    expect(response.headers["set-cookie"][0]).toContain("HttpOnly");
    expect(response.headers["set-cookie"][0]).toContain("SameSite=Lax");
  });

  it("POST /auth/login rejects invalid request bodies before reaching the service", async () => {
    await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: "not-an-email",
        password: "123",
      })
      .expect(400);

    expect(authService.login).not.toHaveBeenCalled();
  });

  it("POST /auth/logout clears the auth cookie", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/logout")
      .expect(200);

    expect(response.body).toEqual({ message: "Logged out successfully" });
    expect(response.headers["set-cookie"][0]).toContain("Authentication=;");
    expect(response.headers["set-cookie"][0]).toContain("Path=/");
  });

  it("GET /auth/me returns the authenticated user from the request context", async () => {
    const response = await request(app.getHttpServer())
      .get("/auth/me")
      .expect(200);

    expect(response.body).toEqual({ user: authenticatedUser });
  });
});
