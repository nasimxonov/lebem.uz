import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiBody({
    schema: {
      properties: {
        fullname: {
          type: 'string',
          example: 'Saidnurmuhammadulloxon Nasimxonov',
          description: "Foydalanuvchining to'liq ismi",
        },
        phone: {
          type: 'string',
          example: '+998901234567',
          description: 'Foydalanuvchining telefon raqami',
        },
      },
      required: ['fullname', 'phone'],
    },
  })
  @ApiResponse({ status: 201, description: 'Aloqa muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 400, description: "Xato ma'lumot kiritildi" })
  create(@Body() body: { fullname: string; phone: string }) {
    return this.contactService.create(body);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Barcha kontaktlar royxati' })
  findAll() {
    return this.contactService.findAll();
  }
}
