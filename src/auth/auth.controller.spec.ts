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
    it('should login and return tokens', async () => {
      (authService.login as jest.Mock).mockResolvedValue(fakeResponse);

      const result = await controller.login({
        email: 'test@example.com',
        password: '123456',
      });

      expect(authService.login).toHaveBeenCalledWith('test@example.com', '123456');
      expect(result).toEqual(fakeResponse);
    });
  });

  describe('refresh()', () => {
    it('should refresh and return new tokens', async () => {
      (authService.refresh as jest.Mock).mockResolvedValue(fakeResponse);

      const result = await controller.refresh({ refreshToken: 'valid-token' });

      expect(authService.refresh).toHaveBeenCalledWith('valid-token');
      expect(result).toEqual(fakeResponse);
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
    it('should call authService.logout with refreshToken', async () => {
      const body = { refreshToken: 'some-refresh-token' };

      await controller.logout(body);

      expect(mockAuthService.logout).toHaveBeenCalledWith('some-refresh-token');
    });
  });
});
