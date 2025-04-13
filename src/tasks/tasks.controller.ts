import { Controller, Get, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }
}
