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
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiBody, ApiParam, ApiConsumes, ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createMulterOptions } from 'src/common/utils/upload.utils';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10, createMulterOptions('./uploads/products', true)))
  async create(@UploadedFiles() files: Express.Multer.File[], @Body() body: CreateProductDto, @Req() req: any) {
    const imageUrls = files.map((file) => `/uploads/products/${file.filename}`);
    return await this.productsService.create({ ...body, imageUrls });
  }

  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10, createMulterOptions('./uploads/products')))
  async update(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[], @Body() body: UpdateProductDto, @Req() req: any) {
    const imageUrls = files ? files.map((file) => `/uploads/products/${file.filename}`) : [];
    return this.productsService.update(id, { ...body, imageUrls });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @Req() req: any) {
    return await this.productsService.remove(id);
  }

  @Delete('image/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'id', type: 'string' })
  async removeImage(@Param('id') id: string, @Req() req: any) {
    return await this.productsService.removeImage(id);
  }
}
