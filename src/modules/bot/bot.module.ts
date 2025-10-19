// bot.module.ts
import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { TelegrafModule } from 'nestjs-telegraf';
import { Redis } from '@telegraf/session/redis';
import { session } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { RegistrationScene } from './scenes/register.scene';
import { BotController } from './bot.controller';
import { BullModule } from '@nestjs/bull';
import { BotProcessor } from './bot.processor';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    TelegramModule,
    BullModule.registerQueue({
      name: 'botQueue',
      limiter: {
        max: 2,
        duration: 1000,
      },
    }),
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const store = Redis({
          url: config.getOrThrow<string>('REDIS_URL'),
        });

        return {
          token: config.get<string>('TELEGRAM_BOT_TOKEN')!,
          middlewares: [session({ store })],
        };
      },
    }),
  ],
  controllers: [BotController],
  providers: [BotProcessor, BotService, BotUpdate, RegistrationScene],
})
export class BotModule {}
