import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiBody({
    schema: {
      properties: {
        title: { type: 'string' },
      },
    },
  })
  create(@Body() body: any) {
    return this.categoryService.create(body);
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
  @ApiBody({
    schema: {
      properties: {
        title: { type: 'string' },
      },
    },
  })
  update(@Param('id') id: string, @Body() body: any) {
    return this.categoryService.update(id, body);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
