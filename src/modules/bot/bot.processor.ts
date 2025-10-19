import { Processor, Process, OnQueueProgress, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import type { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';
import { PrismaService } from 'src/core/database/prisma.service';
import { RecipientStatus } from '@prisma/client';

export interface IMessageQueueData {
  userId: string;
  messageId: number;
  images: string[];
  message: string;
}

@Processor('botQueue')
@Injectable()
export class BotProcessor {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly prisma: PrismaService,
  ) {}

  @Process('sendMessage')
  async handle({ data: { userId, message, images, messageId } }: Job<IMessageQueueData>) {
    try {
      await this.telegramService.sendMessage(userId, message, images);

      await this.prisma.messageRecipient.update({
        where: { id: messageId },
        data: { status: RecipientStatus.SENT },
      });
    } catch (e) {
      console.log(e);
      

      await this.prisma.messageRecipient.update({
        where: { id: messageId },
        data: { status: RecipientStatus.FAILED },
      });
    }
  }
}
