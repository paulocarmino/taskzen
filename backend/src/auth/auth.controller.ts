import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  Delete,
  Res,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response } from 'express';
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
import { LogoutDto } from '../auth/dto/logout.dto';
import { setRefreshTokenCookie } from '../auth/utils/set-refresh-cookies';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({ type: AuthResponse, description: 'Returns access and refresh tokens' })
  signup(@Body() body: SignUpDto) {
    return this.authService.signup(body.email, body.name, body.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ type: AuthResponse, description: 'Returns access token. Refresh token is set via HttpOnly cookie.' })
  async login(@Body() body: SignInDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(body.email, body.password);

    setRefreshTokenCookie(res, refreshToken);

    return { accessToken };
  }

  @Post('token/refresh')
  @ApiOperation({ summary: 'Refresh access token using a valid refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ type: AuthResponse, description: 'Returns new access and refresh tokens' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshTokenFromCookies = req.cookies?.refreshToken;
    if (!refreshTokenFromCookies) throw new ForbiddenException('Refresh token missing');

    const { accessToken, refreshToken } = await this.authService.refresh(refreshTokenFromCookies);

    setRefreshTokenCookie(res, refreshToken);

    return { accessToken };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get logged-in user profile' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  getMe(@CurrentUser() user: User): UserEntity {
    return new UserEntity(user);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout (invalidate refresh token)' })
  @ApiBody({ type: LogoutDto })
  @HttpCode(204)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const raw = req.cookies?.refreshToken;
    if (raw) {
      await this.authService.logout(raw);
    }

    res.clearCookie('refreshToken', {
      path: '/auth/token/refresh',
    });
  }
}
