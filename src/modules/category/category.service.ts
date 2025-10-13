import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

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
      throw new BadRequestException({
        message: 'Kategoriya yaratishda xatolik',
        error: error.message,
        code: error.code,
        meta: error.meta,
      });
    }
  }

  async findAll() {
    try {
      return await this.prisma.categories.findMany({
        include: { products: true },
      });
    } catch (error) {
      throw new BadRequestException({
        message: 'Kategoriyalarni olishda xatolik',
        error: error.message,
      });
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.categories.findUnique({
        where: { id },
        include: { products: true },
      });

      if (!category)
        throw new NotFoundException({ message: 'Kategoriya topilmadi' });

      return category;
    } catch (error) {
      throw new BadRequestException({
        message: 'Kategoriya maʼlumotini olishda xatolik',
        error: error.message,
      });
    }
  }

  async update(id: string, data: { title?: string; image?: string }) {
    try {
      const existing = await this.prisma.categories.findUnique({
        where: { id },
      });

      if (!existing)
        throw new NotFoundException({ message: 'Kategoriya topilmadi' });

      const updatedData = {
        title: data.title ?? existing.title,
        image: data.image ?? existing.image,
      };

      return await this.prisma.categories.update({
        where: { id },
        data: updatedData,
      });
    } catch (error) {
      throw new BadRequestException({
        message: 'Kategoriya yangilashda xatolik',
        error: error.message,
        code: error.code,
        meta: error.meta,
      });
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.prisma.categories.findUnique({
        where: { id },
      });
      if (!existing)
        throw new NotFoundException({ message: 'Kategoriya topilmadi' });

      return await this.prisma.categories.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException({
        message: 'Kategoriya o‘chirishda xatolik',
        error: error.message,
        code: error.code,
        meta: error.meta,
      });
    }
  }

  async removeImage(id: string) {
    try {
      const existing = await this.prisma.categories.findUnique({
        where: { id },
      });

      if (!existing)
        throw new NotFoundException({ message: 'Kategoriya topilmadi' });

      if (existing.image) {
        const fileName = path.basename(existing.image);
        const imagePath = path.join(
          process.cwd(),
          'uploads',
          'categories',
          fileName,
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await this.prisma.categories.update({
        where: { id },
        data: { image: null },
      });

      return { message: "Kategoriya rasmi o'chirildi" };
    } catch (error) {
      throw new BadRequestException({
        message: 'Kategoriya rasmini o‘chirishda xatolik',
        error: error.message,
        code: error.code,
      });
    }
  }
}
