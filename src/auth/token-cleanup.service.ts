import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

const EVERY_HOUR = '0 * * * *';

@Injectable()
export class TokenCleanupService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(EVERY_HOUR)
  async cleanupExpiredRefreshTokens() {
    console.log(`Running expired token cleanup...`);

    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    if (result.count > 0) {
      console.log(`Deleted ${result.count} expired refresh tokens`);
    }
  }
}
