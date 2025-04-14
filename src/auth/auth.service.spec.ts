import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from '../user/user.repository';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const mockUser = {
  id: 'user-1',
  email: 'test@user.com',
  password: '',
  role: 'USER',
};

const createMockUser = async (password: string = '123456') => ({
  ...mockUser,
  password: await bcrypt.hash(password, 10),
});

const mockUserRepository = {
  create: jest.fn(),
  findByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('fake-jwt'),
};

const mockPrismaService = {
  refreshToken: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a user and return tokens', async () => {
    mockUserRepository.create.mockResolvedValue({ id: 'user-1', role: 'USER' });

    const result = await authService.register('email@test.com', '123456');

    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(mockJwtService.sign).toHaveBeenCalled();
    expect(mockPrismaService.refreshToken.create).toHaveBeenCalled();
    expect(result).toEqual({
      accessToken: 'fake-jwt',
      refreshToken: expect.any(String),
    });
  });

  it('should login with correct credentials', async () => {
    const hashedUser = await createMockUser('123456');
    mockUserRepository.findByEmail.mockResolvedValue(hashedUser);

    const result = await authService.login('test@example.com', '123456');

    expect(result).toEqual({
      accessToken: 'fake-jwt',
      refreshToken: expect.any(String),
    });
  });

  it('should throw UnauthorizedException for wrong password', async () => {
    const hashedUser = await createMockUser('senha-correta');
    mockUserRepository.findByEmail.mockResolvedValue(hashedUser);

    await expect(authService.login('test@example.com', 'senha-errada')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException for nonexistent user', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(authService.login('fake@example.com', '123456')).rejects.toThrow(UnauthorizedException);
  });

  it('should refresh token if valid', async () => {
    const hashedToken = await bcrypt.hash('valid-refresh', 10);
    mockPrismaService.refreshToken.findMany.mockResolvedValue([
      {
        token: hashedToken,
        expiresAt: new Date(Date.now() + 10000),
        user: mockUser,
      },
    ]);

    const result = await authService.refresh('valid-refresh');

    expect(result).toEqual({
      accessToken: 'fake-jwt',
      refreshToken: expect.any(String),
    });
  });

  it('should throw ForbiddenException on invalid refresh token', async () => {
    mockPrismaService.refreshToken.findMany.mockResolvedValue([]);

    await expect(authService.refresh('bad-refresh')).rejects.toThrow(ForbiddenException);
  });

  it('should throw ConflictException when email already exists', async () => {
    const duplicateEmailError = new PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: '6.6.0',
    });

    mockUserRepository.create.mockRejectedValueOnce(duplicateEmailError);

    await expect(authService.register('user@example.com', 'P4$sw0rd!')).rejects.toThrow(ConflictException);
  });

  it('should throw ForbiddenException if refresh token is expired', async () => {
    const expiredToken = {
      token: await bcrypt.hash('expired-token', 10),
      expiresAt: new Date(Date.now() - 60 * 1000), // expired
      user: { id: 'user-1', role: 'USER' },
    };

    mockPrismaService.refreshToken.findMany.mockResolvedValue([expiredToken]);

    await expect(authService.refresh('expired-token')).rejects.toThrow();
  });
});
