import { Exclude } from 'class-transformer';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @Exclude()
  password: string;

  @ApiProperty({ enum: ['USER', 'ADMIN'] })
  role: Role;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
