import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class TelegramUserRegisterDTO {
  telegramId: string;
  fullName?: string;
  phoneNumber?: string;
}

export class TelegramUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  telegramId: string;

  @ApiProperty()
  fullName?: string;

  @ApiProperty()
  phoneNumber?: string;
}
