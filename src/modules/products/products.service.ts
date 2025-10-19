import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateProductDto } from './dto/update-product.dto';
import { ReorderDTO } from './dto/reorder.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; price: number; description: string; categoryId: string; imageUrls: string[] }) {
    const category = await this.prisma.categories.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) throw new NotFoundException('Category not found');

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
  }

  async findAll() {
    return this.prisma.products.findMany({
      include: { category: true, images: true },
      orderBy: { order: 'asc' },
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

  async update(id: string, data: UpdateProductDto & { imageUrls: string[] }) {
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
  }

  async remove(id: string) {
    const existing = await this.prisma.products.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');

    return this.prisma.products.delete({ where: { id } });
  }

  async removeImage(id: string) {
    const image = await this.prisma.productImages.findUnique({
      where: { id },
    });

    if (!image) throw new NotFoundException('Rasm topilmadi');

    const fileName = path.basename(image.imageUrl);
    const imagePath = path.join(process.cwd(), 'uploads', 'products', fileName);

    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        throw new InternalServerErrorException("Faylni o'chirishda xatolik yuz berdi");
      }
    }

    await this.prisma.productImages.delete({ where: { id } });

    return { status: 200, message: "Rasm muvaffaqiyatli o'chirildi" };
  }

  async reorder(dto: ReorderDTO[]): Promise<any> {
    const updates = dto.map((item) =>
      this.prisma.products.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    );

    await this.prisma.$transaction(updates);

    return { status: 200, message: 'Products reordered successfully' };
  }
}
