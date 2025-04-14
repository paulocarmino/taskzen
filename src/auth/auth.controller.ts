import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthService, AuthResponse } from './auth.service';
import { CurrentUser } from './decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  register(@Body() body: { email: string; password: string }): Promise<AuthResponse> {
    return this.authService.register(body.email, body.password);
  }

  @Post('signin')
  login(@Body() body: { email: string; password: string }): Promise<AuthResponse> {
    return this.authService.login(body.email, body.password);
  }

  @Post('token/refresh')
  refresh(@Body() body: { refreshToken: string }): Promise<AuthResponse> {
    return this.authService.refresh(body.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: User): UserEntity {
    return new UserEntity(user);
  }
}
