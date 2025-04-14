import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { PrismaService } from '../prisma/prisma.service';

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
    const user = { id: 'user-1', email: 'test@example.com', password: 'hashed' };
    mockPrisma.user.create.mockResolvedValue(user);

    const result = await repository.create(user.email, user.password);

    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: { email: user.email, password: user.password },
    });
    expect(result).toBe(user);
  });

  it('should find a user by email', async () => {
    const user = { id: 'user-1', email: 'test@example.com', password: 'hashed' };
    mockPrisma.user.findUnique.mockResolvedValue(user);

    const result = await repository.findByEmail(user.email);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: user.email },
    });
    expect(result).toBe(user);
  });
});
