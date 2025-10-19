import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { TelegramUserRegisterDTO } from './dto/telegram-user.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { IMessageQueueData } from './bot.processor';

@Injectable()
export class BotService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('botQueue') private botQueue: Queue<IMessageQueueData>,
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
    const telegramIds = JSON.parse(body.telegram_ids);

    const message = await this.prisma.message.create({
      data: {
        text: body.message,
        recipients: {
          create: telegramIds.map((id: string) => ({ userId: id.toString() })),
        },
      },
    });

    for (let index = 0; index < telegramIds.length; index++) {
      const id = telegramIds[index];

      await this.botQueue.add('sendMessage', {
        userId: id,
        messageId: message.id,
        message: body.message,
        images: images.map((i) => `/uploads/message-images/${i.filename}`),
      });
    }

    return { status: 'queued', count: telegramIds.length };
  }
}
