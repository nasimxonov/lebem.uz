import { Body, Controller, Get, Param, Post, Patch, Delete, UploadedFile, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags, ApiBody, ApiParam, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { createMulterOptions } from 'src/common/utils/upload.utils';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', createMulterOptions('./uploads/categories', true)))
  async create(@Body() body: CreateCategoryDto, @UploadedFile() image: Express.Multer.File) {
    const imageUrl = image ? `/uploads/categories/${image.filename}` : undefined;

    return await this.categoryService.create({
      title: body.title,
      image: imageUrl,
    });
  }

  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', createMulterOptions('./uploads/categories', true)))
  async update(@Param('id') id: string, @Body() body: UpdateCategoryDTO, @UploadedFile() image: Express.Multer.File, @Req() req: any) {
    const imageUrl = image ? `/uploads/categories/${image.filename}` : undefined;
    
    return await this.categoryService.update(id, {
      title: body.title,
      image: imageUrl,
    });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'id', type: 'string' })
  async remove(@Param('id') id: string, @Req() req: any) {
    return await this.categoryService.remove(id);
  }
}
