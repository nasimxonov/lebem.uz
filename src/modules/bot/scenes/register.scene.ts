import { Injectable } from '@nestjs/common';
import { Scene, SceneEnter, Ctx, On, Action, Command } from 'nestjs-telegraf';
import type { SceneContext, WizardContext } from 'telegraf/scenes';
import { Message } from 'telegraf/types';
import { BotService } from '../bot.service';

interface UserData {
  fullName?: string;
  contact?: string;
  phone?: string;
}

@Scene('registration')
@Injectable()
export class RegistrationScene {
  constructor(private readonly userService: BotService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: WizardContext) {
    const existingUser = await this.userService.findUserById(ctx.from!.id);

    if (existingUser) {
      await ctx.reply(`Siz allaqachon ro'yxatdan o'tgansiz!\n\nIsmingiz: ${existingUser.fullName}\nTelefon: ${existingUser.phone}`);

      await ctx.scene.leave();
      return;
    }

    await ctx.reply("Assalomu alaykum! Ro'yxatdan o'tish uchun ismingizni kiriting:");
  }

  @Command('exit')
  @Command('cancel')
  async exitCommand(@Ctx() ctx: SceneContext) {
    if (ctx.scene?.current) {
      await ctx.scene.leave();
    }
    await ctx.reply('✅ Amaliyot bekor qilindi.', {
      reply_markup: {
        remove_keyboard: true,
      },
    });
  }

  @On('text')
  async onText(@Ctx() ctx: WizardContext) {
    const userData = (ctx.scene.session.state as UserData) || {};
    const messageText = (ctx.message as any).text;

    if (!userData.fullName) {
      userData.fullName = messageText;
      ctx.scene.session.state = userData;

      await ctx.reply('Endi telefon raqamingizni yuboring:', {
        reply_markup: {
          keyboard: [[{ text: '📞 Telefon raqamimni yuborish', request_contact: true }]],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    } else if (userData.fullName && !userData.phone) {
      userData.phone = messageText;
      await this.completeRegistration(ctx, userData);
    }
  }

  @On('contact')
  async onContact(@Ctx() ctx: WizardContext) {
    const userData = ctx.scene.session.state as UserData;
    const contact = (ctx.message as Message.ContactMessage).contact;

    userData.phone = contact.phone_number;
    userData.contact = `${contact.first_name} ${contact.last_name || ''}`.trim();

    await this.completeRegistration(ctx, userData);
  }

  private async completeRegistration(@Ctx() ctx: WizardContext, userData: UserData) {
    await this.userService.createUser({
      telegramId: ctx.from!.id.toString(),
      fullName: userData.fullName!,
      phoneNumber: userData.phone!,
    });

    await ctx.reply(`🎉 Tabriklaymiz! Ro'yxatdan muvaffaqiyatli o'tdingiz!\n\nEndi kataloglarimizni ko'rishingiz mumkin:`, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📂 Kataloglarni ko'rish",
              web_app: { url: 'https://lebem.uz' },
            },
          ],
        ],
      },
    });

    await ctx.scene.leave();
  }
}
