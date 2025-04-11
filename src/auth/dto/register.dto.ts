import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'exampleUser' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'examplePassword' })
  @IsString()
  password: string;
}
