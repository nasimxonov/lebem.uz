import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    price: number;
    description: string;
    categoryId: string;
  }) {
    try {
      const category = await this.prisma.categories.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) throw new NotFoundException('category not found');

      return await this.prisma.products.create({ data });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      return await this.prisma.products.findMany({
        include: { category: true, images: true },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.products.findUnique({
        where: { id },
        include: { category: true, images: true },
      });

      if (!product) throw new NotFoundException('Product not found');
      return product;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(
    id: string,
    data: {
      title?: string;
      price?: number;
      description?: string;
      categoryId?: string;
    },
  ) {
    try {
      const existing = await this.prisma.products.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('product not found');

      return await this.prisma.products.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.prisma.products.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('Product not found');

      return await this.prisma.products.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
