import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @ApiProperty({ type: 'string' })
  telegram_ids: string;

  @IsString()
  @ApiProperty({ type: 'string' })
  message: string;
}
