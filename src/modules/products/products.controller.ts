import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiBody, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          const uniqueName = uuid() + extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        price: { type: 'number' },
        description: { type: 'string' },
        categoryId: { type: 'string' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
    @Req() req: any,
  ) {
    if (!req.user)
      throw new UnauthorizedException('Foydalanuvchi tizimga kirmagan');

    const imageUrls = files.map((file) => `/uploads/products/${file.filename}`);
    return this.productsService.create({
      title: body.title,
      price: Number(body.price),
      description: body.description,
      categoryId: body.categoryId,
      imageUrls,
    });
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/products',
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
        price: { type: 'number' },
        description: { type: 'string' },
        categoryId: { type: 'string' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
    @Req() req: any,
  ) {
    if (!req.user)
      throw new UnauthorizedException('Foydalanuvchi tizimga kirmagan');

    const imageUrls = files
      ? files.map((file) => `/uploads/products/${file.filename}`)
      : [];
    return this.productsService.update(id, {
      title: body.title,
      price: Number(body.price),
      description: body.description,
      categoryId: body.categoryId,
      imageUrls,
    });
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string, @Req() req: any) {
    if (!req.user)
      throw new UnauthorizedException('Foydalanuvchi tizimga kirmagan');

    return this.productsService.remove(id);
  }

  @Delete('image/:id')
  @ApiParam({ name: 'id', type: 'string' })
  removeImage(@Param('id') id: string, @Req() req: any) {
    if (!req.user)
      throw new UnauthorizedException('Foydalanuvchi tizimga kirmagan');

    return this.productsService.removeImage(id);
  }
}
