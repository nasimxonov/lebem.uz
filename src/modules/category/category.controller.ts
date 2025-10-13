import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags, ApiBody, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, callback) => {
          const uniqueName = uuid() + extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  create(@Body() body: any, @UploadedFile() image: Express.Multer.File) {
    const imageUrl = image
      ? `/uploads/categories/${image.filename}`
      : undefined;

    return this.categoryService.create({
      title: body.title,
      image: imageUrl,
    });
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, callback) => {
          const uniqueName = uuid() + extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const imageUrl = image
      ? `/uploads/categories/${image.filename}`
      : undefined;

    return this.categoryService.update(id, {
      title: body.title,
      image: imageUrl,
    });
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }

  @Delete('image/:id')
  @ApiParam({ name: 'id', type: 'string' })
  removeImage(@Param('id') id: string) {
    return this.categoryService.removeImage(id);
  }
}
