import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { UpdatePasswordDTO } from './dto/update-password.dto';

import bcrypt from 'bcrypt';

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

  async changePassword(user: any, body: UpdatePasswordDTO) {
    const { oldPassword, newPassword } = body;

    const existingUser = await this.prisma.users.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, existingUser.password);

    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.users.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { status: 'ok', message: 'Password updated successfully' };
  }
}
