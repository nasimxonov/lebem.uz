import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
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

      if (!category) throw new NotFoundException('Category not found');
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

      if (!existing) throw new NotFoundException('Category not found');

      const updatedData: any = {
        title: data.title ?? existing.title,
        image: data.image ?? existing.image,
      };

      return await this.prisma.categories.update({
        where: { id },
        data: updatedData,
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
      if (!existing) throw new NotFoundException('Category not found');

      return await this.prisma.categories.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async removeImage(id: string) {
    try {
      const existing = await this.prisma.categories.findUnique({
        where: { id },
      });

      if (!existing) throw new NotFoundException('Kategoriya topilmadi');

      if (existing.image) {
        const fileName = path.basename(existing.image);
        const imagePath = path.join(
          process.cwd(),
          'uploads',
          'categories',
          fileName,
        );

        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          } else {
            throw new NotFoundException('Kategoriya rasmi tizimda topilmadi');
          }
        } catch (err) {
          throw new InternalServerErrorException(
            "Kategoriya rasmini o'chirishda xatolik yuz berdi",
          );
        }
      }

      await this.prisma.categories.update({
        where: { id },
        data: { image: null },
      });

      return { message: "Kategoriya rasmi o'chirildi" };
    } catch (error) {
      throw new BadRequestException(
        error.message || "Kategoriya o'chirishda xatolik yuz berdi",
      );
    }
  }
}
