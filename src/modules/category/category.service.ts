import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; image?: string }) {
    try {
      return await this.prisma.categories.create({
        data: {
          title: data.title,
          image: data.image ?? undefined,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      return await this.prisma.categories.findMany({
        include: { products: true },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.categories.findUnique({
        where: { id },
        include: { products: true },
      });

      if (!category) throw new NotFoundException('category not found');
      return category;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: string, data: { title?: string; image?: string }) {
    try {
      const existing = await this.prisma.categories.findUnique({
        where: { id },
      });

      if (!existing) throw new NotFoundException('category not found');

      return await this.prisma.categories.update({
        where: { id },
        data: {
          title: data.title ?? existing.title,
          image: data.image ?? existing.image,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.prisma.categories.findUnique({
        where: { id },
      });
      if (!existing) throw new NotFoundException('category not found');

      return await this.prisma.categories.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
