import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(user: any) {
    try {
      if (user.role === 'admin') {
        return { username: user.username };
      }

      const me = await this.prisma.users.findUnique({
        where: { id: user.id },
        select: { id: true, first_name: true, last_name: true, username: true },
      });

      return me;
    } catch (error) {
      console.error('GetMe error:', error);
      throw new InternalServerErrorException(error);
    }
  }
}
