import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty({ required: false })
  title: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image: any;
}
