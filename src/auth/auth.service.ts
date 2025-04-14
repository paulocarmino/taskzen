import { Injectable, UnauthorizedException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';

import { UserRepository } from '../user/user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { AuthResponse } from '../auth/dto/auth-response.dto';
import { parseDuration } from '../../src/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(email: string, name: string, password: string): Promise<AuthResponse> {
    const hashed = await bcrypt.hash(password, 10);

    try {
      const user = await this.userRepo.create(email, name, hashed);
      return this.generateTokens(user.id, user.role);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('E-mail already in use');
      }
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.userRepo.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.role);
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const tokens = await this.prisma.refreshToken.findMany({
      include: { user: true },
    });

    const tokenEntry = tokens.find((entry) => entry.expiresAt > new Date() && bcrypt.compareSync(refreshToken, entry.token));

    if (!tokenEntry) throw new ForbiddenException('Invalid or expired refresh token');

    return this.generateTokens(tokenEntry.user.id, tokenEntry.user.role);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokens = await this.prisma.refreshToken.findMany();

    const tokenEntry = tokens.find((entry) => bcrypt.compareSync(refreshToken, entry.token));

    if (tokenEntry) {
      await this.prisma.refreshToken.delete({ where: { id: tokenEntry.id } });
    }
  }

  private async generateTokens(userId: string, role: Role): Promise<AuthResponse> {
    const payload = { sub: userId, role };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = randomUUID();
    const hashed = await bcrypt.hash(refreshToken, 10);

    const refreshExpiresIn = parseDuration(process.env.REFRESH_TOKEN_EXPIRES_IN || '7d');

    await this.prisma.refreshToken.create({
      data: {
        token: hashed,
        userId,
        expiresAt: new Date(Date.now() + refreshExpiresIn),
      },
    });

    return { accessToken, refreshToken };
  }
}
