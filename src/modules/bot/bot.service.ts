import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { TelegramUserRegisterDTO } from './dto/telegram-user.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class BotService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('botQueue') private botQueue: Queue,
  ) {}

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

  async queueMessage(body: SendMessageDto, images: Express.Multer.File[] = []) {
    for (let index = 0; index < body.telegramIds.length; index++) {
      const id = body.telegramIds[index];

      await this.botQueue.add('sendMessage', {
        userId: id,
        message: `${index} ${body.message}`,
        images: images.map((i) => i.path),
      });
    }

    return { status: 'queued', count: body.telegramIds.length };
  }

  async getAllUserIds(): Promise<string[]> {
    const result = await this.prisma.botUser.findMany({
      select: {
        telegramId: true,
      },
    });

    return result.map((e) => e.telegramId);
  }
}
