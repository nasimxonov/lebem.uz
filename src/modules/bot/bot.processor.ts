import { Processor, Process, OnQueueProgress, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import type { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';

@Processor('botQueue')
@Injectable()
export class BotProcessor {
  constructor(private readonly telegramService: TelegramService) {}

  @Process('sendMessage')
  async handle(job: Job<{ userId: string; message: string }>) {
    const { userId, message } = job.data;
    await this.telegramService.sendMessage(userId, message);
    await job.progress(100);
  }

  @OnQueueProgress()
  onProgress(job: Job, progress: number) {
    console.log(`Job ${job.id} progress: ${progress}%`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`✅ Job ${job.id} completed`);
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    console.error(`❌ Job ${job.id} failed:`, err.message);
  }
}
