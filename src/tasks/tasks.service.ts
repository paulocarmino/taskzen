import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.task.findMany();
  }

  findByUser(userId: string) {
    return this.prisma.task.findMany({ where: { userId } });
  }

  async findOneOrFail(id: string, user: User) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException();
    }
    return task;
  }

  create(data: { title: string; content?: string }, userId: string) {
    return this.prisma.task.create({ data: { ...data, userId } });
  }

  async update(id: string, data: any, user: User) {
    const task = await this.findOneOrFail(id, user);
    return this.prisma.task.update({ where: { id: task.id }, data });
  }

  async delete(id: string, user: User) {
    const task = await this.findOneOrFail(id, user);
    await this.prisma.task.delete({ where: { id: task.id } });

    return { success: true };
  }
}
