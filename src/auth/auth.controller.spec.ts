import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResponse } from 'src/auth/dto/auth-response.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService: Partial<AuthService> = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
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

  const fakeResponse: AuthResponse = {
    accessToken: 'fake-access-token',
    refreshToken: 'fake-refresh-token',
  };

  it('should register a user and return tokens', async () => {
    (authService.register as jest.Mock).mockResolvedValue(fakeResponse);

    const result = await controller.register({
      email: 'test@example.com',
      password: '123456',
    });

    expect(authService.register).toHaveBeenCalledWith('test@example.com', '123456');
    expect(result).toEqual(fakeResponse);
  });

  it('should login and return tokens', async () => {
    (authService.login as jest.Mock).mockResolvedValue(fakeResponse);

    const result = await controller.login({
      email: 'test@example.com',
      password: '123456',
    });

    expect(authService.login).toHaveBeenCalledWith('test@example.com', '123456');
    expect(result).toEqual(fakeResponse);
  });

  it('should refresh and return new tokens', async () => {
    (authService.refresh as jest.Mock).mockResolvedValue(fakeResponse);

    const result = await controller.refresh({ refreshToken: 'valid-token' });

    expect(authService.refresh).toHaveBeenCalledWith('valid-token');
    expect(result).toEqual(fakeResponse);
  });
});
