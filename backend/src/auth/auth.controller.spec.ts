import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResponse } from 'src/auth/dto/auth-response.dto';
import { UserEntity } from 'src/user/user.entity';
import { instanceToPlain } from 'class-transformer';
import { Role } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const fakeResponse: AuthResponse = {
    accessToken: 'fake-access-token',
    refreshToken: 'fake-refresh-token',
  };

  const mockUser: UserEntity = {
    id: 'user-1',
    email: 'x@x.com',
    name: 'Fulano de Tal',
    role: Role.USER,
    password: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthService: Partial<AuthService> = {
    signup: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
  };

  const mockRes = () => ({
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('signup()', () => {
    it('should register a user and return tokens', async () => {
      (authService.signup as jest.Mock).mockResolvedValue(fakeResponse);

      const result = await controller.signup({
        email: 'test@example.com',
        name: 'Fulano de Tal',
        password: '123456',
      });

      expect(authService.signup).toHaveBeenCalledWith('test@example.com', 'Fulano de Tal', '123456');
      expect(result).toEqual(fakeResponse);
    });
  });

  describe('login()', () => {
    it('should login and set cookie + return accessToken', async () => {
      const res = mockRes();
      (authService.login as jest.Mock).mockResolvedValue(fakeResponse);

      const result = await controller.login({ email: 'test@example.com', password: '123456' }, res as any);

      expect(authService.login).toHaveBeenCalledWith('test@example.com', '123456');
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        fakeResponse.refreshToken,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          path: '/auth/token/refresh',
          sameSite: 'lax',
          maxAge: expect.any(Number),
        }),
      );
      expect(result).toEqual({ accessToken: fakeResponse.accessToken });
    });
  });

  describe('refresh()', () => {
    it('should refresh and set cookie + return new accessToken', async () => {
      const req = { cookies: { refreshToken: 'valid-token' } };
      const res = mockRes();
      (authService.refresh as jest.Mock).mockResolvedValue(fakeResponse);

      const result = await controller.refresh(req as any, res as any);

      expect(authService.refresh).toHaveBeenCalledWith('valid-token');
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        fakeResponse.refreshToken,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          path: '/auth/token/refresh',
          sameSite: 'lax',
          maxAge: expect.any(Number),
        }),
      );
      expect(result).toEqual({ accessToken: fakeResponse.accessToken });
    });
  });

  describe('me()', () => {
    it('should return a UserEntity instance from CurrentUser', () => {
      const result = instanceToPlain(controller.getMe(mockUser));

      expect(result).toEqual(
        expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          name: mockUser.name,
        }),
      );

      expect(result.password).toBeUndefined();
    });
  });

  describe('logout()', () => {
    it('should call authService.logout with refreshToken from cookies and clear cookie', async () => {
      const req = { cookies: { refreshToken: 'some-refresh-token' } };
      const res = mockRes();

      await controller.logout(req as any, res as any);

      expect(mockAuthService.logout).toHaveBeenCalledWith('some-refresh-token');
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken', {
        path: '/auth/token/refresh',
      });
    });
  });
});
