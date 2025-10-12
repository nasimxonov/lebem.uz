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
    imageUrls: string[];
  }) {
    try {
      const category = await this.prisma.categories.findUnique({
        where: { id: data.categoryId },
      });
      
      if (!category) throw new NotFoundException('Category not found');
      
      console.log("salom");
      console.log(data.imageUrls);
      

      return await this.prisma.products.create({
        data: {
          title: data.title,
          price: data.price,
          description: data.description,
          categoryId: data.categoryId,
          images: {
            create: data.imageUrls.map((url) => ({ imageUrl: url })),
          },
        },
        include: { images: true, category: true },
      });
    } catch (error) {
      console.log(error.message);
      
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    return this.prisma.products.findMany({
      include: { category: true, images: true },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: { category: true, images: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    id: string,
    data: {
      title?: string;
      price?: number;
      description?: string;
      categoryId?: string;
      imageUrls?: string[];
    },
  ) {
    try {
      const existing = await this.prisma.products.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('Product not found');

      const updateData: any = {
        title: data.title,
        price: data.price,
        description: data.description,
        categoryId: data.categoryId,
      };

      if (data.imageUrls && data.imageUrls.length > 0) {
        updateData.images = {
          create: data.imageUrls.map((url) => ({ imageUrl: url })),
        };
      }

      return await this.prisma.products.update({
        where: { id },
        data: updateData,
        include: { images: true, category: true },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    const existing = await this.prisma.products.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');

    return this.prisma.products.delete({ where: { id } });
  }
}
