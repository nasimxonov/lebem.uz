import { ApiProperty } from '@nestjs/swagger';
import { IsArray,  IsString } from 'class-validator';

export class SendMessageDto {
  @IsArray()
  @ApiProperty({ isArray: true, type: 'string' })
  telegramIds: string[];

  @IsString()
  @ApiProperty({ type: 'string' })
  message: string;
}
