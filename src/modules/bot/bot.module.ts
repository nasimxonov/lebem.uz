import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { TelegrafModule } from 'nestjs-telegraf';
import { Redis } from '@telegraf/session/redis';
import { session } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { RegistrationScene } from './scenes/register.scene';
import { BotController } from './bot.controller';

@Module({
  imports: [
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
  providers: [BotUpdate, RegistrationScene, BotService],
})
export class BotModule {}
