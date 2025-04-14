import { Controller, Get, Param, UseGuards, Post, Body, Patch, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { Role, User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getAll() {
    return this.tasksService.findAll();
  }

  @Get('mine')
  getMyTasks(@CurrentUser() user: User) {
    console.log('userId', user);
    return this.tasksService.findByUser(user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.findOneOrFail(id, user);
  }

  @Post()
  create(@Body() data: { title: string; content?: string }, @CurrentUser() user: User) {
    return this.tasksService.create(data, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: { title?: string; content?: string }, @CurrentUser() user: User) {
    return this.tasksService.update(id, data, user);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.delete(id, user);
  }
}
