import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Fulano de Tal' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'P4$sw0rd!' })
  @IsString()
  password: string;
}
