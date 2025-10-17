import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; image?: string }) {
    return await this.prisma.categories.create({
      data: {
        title: data.title,
        image: data.image ?? undefined,
      },
    });
  }

  async findAll() {
    return await this.prisma.categories.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return category;
  }

  async update(id: string, data: { title?: string; image?: string }) {
    const existing = await this.prisma.categories.findUnique({
      where: { id },
    });

    if (!existing) throw new NotFoundException({ message: 'Kategoriya topilmadi' });

    const updatedData = {
      title: data.title ?? existing.title,
      image: data.image ?? existing.image,
    };

    return await this.prisma.categories.update({
      where: { id },
      data: updatedData,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.categories.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException({ message: 'Kategoriya topilmadi' });

    return await this.prisma.categories.delete({ where: { id } });
  }
}
