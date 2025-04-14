import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({ example: 'uuid-v4-refresh-token' })
  @IsString()
  refreshToken: string;
}
