import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TokenCleanupService } from 'src/auth/token-cleanup.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
    }),
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, TokenCleanupService],
  controllers: [AuthController],
})
export class AuthModule {}
