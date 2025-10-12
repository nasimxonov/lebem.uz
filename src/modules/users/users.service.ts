import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(user: any) {
    try {
      return { status: 'ok' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
