import { Controller, Post, Body, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '@prisma/client';
import { UserEntity } from '../user/user.entity';
import { AuthResponse } from './dto/auth-response.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({ type: AuthResponse, description: 'Returns access and refresh tokens' })
  register(@Body() body: SignUpDto) {
    return this.authService.register(body.email, body.name, body.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ type: AuthResponse, description: 'Returns access and refresh tokens' })
  login(@Body() body: SignInDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using a valid refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ type: AuthResponse, description: 'Returns new access and refresh tokens' })
  refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get logged-in user profile' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  getMe(@CurrentUser() user: User): UserEntity {
    return new UserEntity(user);
  }
}
