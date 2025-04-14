import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { User } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiBody,
  ApiOperation,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List all tasks (admin only)' })
  @ApiOkResponse({
    description: 'Returns all tasks in the system.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'task-1' },
          title: { type: 'string', example: 'Write docs' },
          content: { type: 'string', example: 'Swagger is love.' },
          userId: { type: 'string', example: 'user-1' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  getAll() {
    return this.tasksService.findAll();
  }

  @Get('mine')
  @ApiOperation({ summary: 'List tasks of the authenticated user' })
  @ApiOkResponse({
    description: 'Returns only the tasks created by the logged-in user.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'task-2' },
          title: { type: 'string', example: 'Fix login issue' },
          content: { type: 'string', example: 'Mobile login crashes on submit.' },
          userId: { type: 'string', example: 'user-1' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  getMyTasks(@CurrentUser() user: User) {
    return this.tasksService.findByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID (if owner or admin)' })
  @ApiOkResponse({
    description: 'Returns the task if the user has permission.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'task-3' },
        title: { type: 'string', example: 'Review PR' },
        content: { type: 'string', example: 'Pull Request #42 needs attention' },
        userId: { type: 'string', example: 'user-1' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  getOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.findOneOrFail(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task for the current user' })
  @ApiBody({ type: CreateTaskDto })
  @ApiOkResponse({
    description: 'Returns the created task.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'task-4' },
        title: { type: 'string', example: 'Deploy app' },
        content: { type: 'string', example: 'Deploy staging build' },
        userId: { type: 'string', example: 'user-1' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  create(@Body() data: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.create(data, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task (owner or admin)' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiOkResponse({ description: 'Returns the updated task.' })
  update(@Param('id') id: string, @Body() data: UpdateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.update(id, data, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task (owner or admin)' })
  @ApiOkResponse({ description: 'Returns the deleted task.' })
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.delete(id, user);
  }
}
