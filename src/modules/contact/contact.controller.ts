import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ContactDto } from './dto/contact.dto';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() body: ContactDto) {
    return await this.contactService.create(body);
  }
}
