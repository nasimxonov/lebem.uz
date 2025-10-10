import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { fullname: string; phone: string }) {
    const contact = await this.prisma.contact.create({ data });
    return {
      message: "Aloqa muvaffaqiyatli qo'shildi ✅",
      data: contact,
    };
  }
}
