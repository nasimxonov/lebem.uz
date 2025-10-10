import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBody({
    schema: {
      properties: {
        title: { type: 'string' },
        price: { type: 'number' },
        description: { type: 'string' },
        categoryId: { type: 'string' },
      },
    },
  })
  create(@Body() body: any) {
    return this.productsService.create(body);
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
  update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
