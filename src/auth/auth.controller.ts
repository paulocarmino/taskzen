import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, AuthResponse } from './auth.service';

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
}
