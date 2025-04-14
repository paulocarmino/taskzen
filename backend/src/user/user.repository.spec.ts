import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from './user.entity';
import { Role } from '@prisma/client';

const mockUser = new UserEntity({
  id: 'user-1',
  email: 'user@example.com',
  name: 'Fulano de Tal',
  password: 'hashed',
  role: Role.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('UserRepository', () => {
  let repository: UserRepository;
  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a new user', async () => {
    mockPrisma.user.create.mockResolvedValue(mockUser);

    const result = await repository.create(mockUser.email, mockUser.name, mockUser.password);

    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: { email: mockUser.email, name: mockUser.name, password: mockUser.password },
    });
    expect(result).toBe(mockUser);
  });

  it('should find a user by email', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);

    const result = await repository.findByEmail(mockUser.email);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockUser.email },
    });
    expect(result).toBe(mockUser);
  });
});
