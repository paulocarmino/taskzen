import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { Role } from '@prisma/client';

const mockUser = new UserEntity({
  id: 'user-1',
  email: 'user@example.com',
  password: 'hashed',
  role: Role.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const mockAdmin = new UserEntity({
  id: 'admin-1',
  email: 'admin@example.com',
  password: 'hashed',
  role: Role.ADMIN,
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
      findMany: jest.fn(),
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

  it('should throw NotFoundException if not found', async () => {
    mockPrisma.task.findUnique.mockResolvedValue(null);

    await expect(service.findOneOrFail('invalid-id', mockUser)).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if not owner or admin', async () => {
    const task = { id: 'task-1', userId: 'someone-else' };
    mockPrisma.task.findUnique.mockResolvedValue(task);

    await expect(service.findOneOrFail('task-1', mockUser)).rejects.toThrow(ForbiddenException);
  });

  it('should return tasks for a given user', async () => {
    const mockTasks = [{ id: 'task-1' }, { id: 'task-2' }];
    mockPrisma.task.findMany.mockResolvedValue(mockTasks);

    const result = await service.findByUser(mockUser.id);

    expect(mockPrisma.task.findMany).toHaveBeenCalledWith({ where: { userId: mockUser.id } });
    expect(result).toEqual(mockTasks);
  });

  it('should return all tasks', async () => {
    const allTasks = [{ id: 'task-1' }, { id: 'task-2' }];
    mockPrisma.task.findMany.mockResolvedValue(allTasks);

    const result = await service.findAll();

    expect(mockPrisma.task.findMany).toHaveBeenCalled();
    expect(result).toEqual(allTasks);
  });

  it('should update task if user is owner', async () => {
    const task = { id: 'task-1', userId: mockUser.id };
    const updateData = { title: 'Updated Task' };

    mockPrisma.task.findUnique.mockResolvedValue(task);
    mockPrisma.task.update.mockResolvedValue({ ...task, ...updateData });

    const result = await service.update(task.id, updateData, mockUser);

    expect(mockPrisma.task.update).toHaveBeenCalledWith({
      where: { id: task.id },
      data: updateData,
    });
    expect(result.title).toEqual(updateData.title);
  });

  it('should return user-specific tasks if user is a regular user', async () => {
    const userTasks = [{ id: 'task-user-1' }];
    mockPrisma.task.findMany.mockResolvedValue(userTasks);

    const result = await service.findByUser(mockUser.id);

    expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
      where: { userId: mockUser.id },
    });
    expect(result).toEqual(userTasks);
  });

  it('should throw ForbiddenException if admin tries to update a task', async () => {
    const task = { id: 'task-1', userId: mockUser.id };
    mockPrisma.task.findUnique.mockResolvedValue(task);

    await expect(service.update(task.id, { title: 'x' }, mockAdmin)).rejects.toThrow(ForbiddenException);
  });
});
