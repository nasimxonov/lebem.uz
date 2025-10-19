import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class ReorderDTO {
  @IsUUID()
  @ApiProperty()
  id: string;

  @IsNumber()
  @ApiProperty()
  order: number;
}
