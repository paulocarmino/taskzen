import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PrismaModule, TasksModule, AuthModule, UserModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
