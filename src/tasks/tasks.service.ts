import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) throw new NotFoundException('Task not found');

    return task;
  }
}
