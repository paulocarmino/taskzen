import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../user/user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { randomUUID } from 'crypto';
import { AuthResponse } from 'src/auth/dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<AuthResponse> {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepo.create(email, hashed);
    return this.generateTokens(user.id, user.role);
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
      where: { expiresAt: { gt: new Date() } },
      include: { user: true },
    });

    const tokenEntry = tokens.find((entry) => bcrypt.compareSync(refreshToken, entry.token));

    if (!tokenEntry) throw new ForbiddenException('Invalid refresh token');

    return this.generateTokens(tokenEntry.user.id, tokenEntry.user.role);
  }

  private async generateTokens(userId: string, role: Role): Promise<AuthResponse> {
    const payload = { sub: userId, role };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = randomUUID();
    const hashed = await bcrypt.hash(refreshToken, 10);

    await this.prisma.refreshToken.create({
      data: {
        token: hashed,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }
}
