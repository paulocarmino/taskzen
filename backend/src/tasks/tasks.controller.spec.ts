import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Role, User } from '@prisma/client';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    findByUser: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findOneOrFail: jest.fn(),
  };

  const mockUser: User = {
    id: 'user-123',
    email: 'user@example.com',
    password: '',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Mock User',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockTasksService }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should get tasks of the current user', async () => {
    await controller.getMyTasks(mockUser);
    expect(service.findByUser).toHaveBeenCalledWith(mockUser.id);
  });

  it('should create a task for the current user', async () => {
    const dto = { title: 'New Task', content: 'Hello' };
    await controller.create(dto, mockUser);
    expect(service.create).toHaveBeenCalledWith(dto, mockUser.id);
  });

  it('should update a task', async () => {
    const dto = { title: 'Updated Title' };
    await controller.update('task-id', dto, mockUser);
    expect(service.update).toHaveBeenCalledWith('task-id', dto, mockUser);
  });

  it('should delete a task', async () => {
    await controller.delete('task-id', mockUser);
    expect(service.delete).toHaveBeenCalledWith('task-id', mockUser);
  });

  it('should find a task by id for the current user', async () => {
    await controller.getOne('task-id', mockUser);
    expect(service.findOneOrFail).toHaveBeenCalledWith('task-id', mockUser);
  });

  it('should return all tasks (admin only)', async () => {
    await controller.getAll();
    expect(service.findAll).toHaveBeenCalled();
  });
});
