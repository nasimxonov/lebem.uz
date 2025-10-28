import { Update, Ctx, Start, Hears, Command, On } from 'nestjs-telegraf';
import type { SceneContext } from 'telegraf/scenes';
import { BotService } from './bot.service';

@Update()
export class BotUpdate {
  constructor(private readonly userService: BotService) {}

  @Start()
  async startCommand(@Ctx() ctx: SceneContext) {
    const userId = ctx.from!.id;
    const existingUser = await this.userService.findUserById(userId);

    if (existingUser) {
      await ctx.reply(`🎉 Hush kelibsiz, ${existingUser.fullName}!`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📂 Kataloglarni ko'rish",
                web_app: { url: 'https://t.me/LebemUzBot/categories' },
              },
            ],
          ],
        },
      });
    } else {
      await ctx.scene.enter('registration');
    }
  }

  @Command('cancel')
  async cancelCommand(@Ctx() ctx: SceneContext) {
    await ctx.scene.leave();
    await ctx.reply('Amaliyot bekor qilindi.', {
      reply_markup: {
        remove_keyboard: true,
      },
    });
  }
}
