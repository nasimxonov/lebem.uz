import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  title: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  price: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  categoryId: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: false })
  images?: Express.Multer.File[];
}
