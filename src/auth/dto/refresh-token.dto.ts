import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'uuid-v4-refresh-token' })
  @IsString()
  refreshToken: string;
}
