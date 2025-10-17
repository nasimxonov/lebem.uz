import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ContactDto) {
    const contact = await this.prisma.contact.create({ data });

    return {
      message: "Aloqa muvaffaqiyatli qo'shildi ✅",
      data: contact,
    };
  }
}
