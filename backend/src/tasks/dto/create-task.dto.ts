import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Fix bug on signup' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'The signup is returning 500 when user alredy exists', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  done?: boolean;
}
