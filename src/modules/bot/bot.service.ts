import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Context } from 'telegraf';
import { TelegramUserRegisterDTO } from './dto/telegram-user.dto';

@Injectable()
export class BotService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(userId: number): Promise<any> {
    return this.prisma.botUser.findUnique({
      where: { telegramId: userId.toString() },
    });
  }

  async findAll(): Promise<any> {
    return await this.prisma.botUser.findMany();
  }

  async createUser(userData: TelegramUserRegisterDTO): Promise<any> {
    return await this.prisma.botUser.create({ data: userData });
  }
}
