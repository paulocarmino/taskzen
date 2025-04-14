import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';

const mockUser = new UserEntity({
  id: 'user-1',
  email: 'user@example.com',
  password: 'hashed',
  role: 'USER',
  createdAt: new Date(),
  updatedAt: new Date(),
});

const mockAdmin = new UserEntity({
  id: 'admin-1',
  email: 'admin@example.com',
  password: 'hashed',
  role: 'ADMIN',
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('TasksService', () => {
  let service: TasksService;
  const mockPrisma = {
    task: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a task with userId', async () => {
    const taskData = { title: 'Test Task', content: 'bla' };
    mockPrisma.task.create.mockResolvedValue({ id: 'task-1', ...taskData });

    const result = await service.create(taskData, mockUser.id);

    expect(mockPrisma.task.create).toHaveBeenCalledWith({
      data: { ...taskData, userId: mockUser.id },
    });
    expect(result).toEqual({ id: 'task-1', ...taskData });
  });

  it('should return task if owner', async () => {
    const task = { id: 'task-1', userId: mockUser.id };
    mockPrisma.task.findUnique.mockResolvedValue(task);

    const result = await service.findOneOrFail('task-1', mockUser);

    expect(result).toBe(task);
  });

  it('should return task if admin', async () => {
    const task = { id: 'task-1', userId: 'other-user' };
    mockPrisma.task.findUnique.mockResolvedValue(task);

    const result = await service.findOneOrFail('task-1', mockAdmin);

    expect(result).toBe(task);
  });

  it('should throw NotFoundException if not found', async () => {
    mockPrisma.task.findUnique.mockResolvedValue(null);

    await expect(service.findOneOrFail('invalid-id', mockUser)).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if not owner or admin', async () => {
    const task = { id: 'task-1', userId: 'someone-else' };
    mockPrisma.task.findUnique.mockResolvedValue(task);

    await expect(service.findOneOrFail('task-1', mockUser)).rejects.toThrow(ForbiddenException);
  });
});
