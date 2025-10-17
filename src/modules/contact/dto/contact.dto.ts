import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ContactDto {
  @ApiProperty()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsString()
  phone: string;
}
