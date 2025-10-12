import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private readonly adminChatId = 'ADMIN_CHAT_ID';

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: true,
    });

    this.bot.onText(/\/start(.*)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const text = match && match[1] ? match[1].trim() : '';
      const productIdMatch = text.match(/product-id=([0-9a-fA-F-]+)/);

      if (productIdMatch) {
        const productId = productIdMatch[1];
        const product = await this.prisma.products.findUnique({
          where: { id: productId },
          include: { category: true, images: true },
        });

        if (product) {
          let message = `🛍 Mahsulot: ${product.title}\n💵 Narx: ${product.price}\n📦 Tavsif: ${product.description}`;
          message += `\n🏷 Kategoriya: ${product.category.title}`;
          if (product.images.length > 0) {
            await this.bot.sendPhoto(chatId, product.images[0].imageUrl, {
              caption: message,
            });
          } else {
            await this.bot.sendMessage(chatId, message);
          }

          await this.bot.sendMessage(chatId, 'Telefon raqamingizni ulashing:', {
            reply_markup: {
              keyboard: [
                [{ text: '📱 Raqamni ulashish', request_contact: true }],
              ],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          });

          this.bot.once('contact', async (contactMsg) => {
            const phoneNumber = contactMsg.contact.phone_number;
            const fullName =
              `${contactMsg.chat.first_name || ''} ${contactMsg.chat.last_name || ''}`.trim();

            await this.prisma.contact.create({
              data: {
                fullname: fullName,
                phone: phoneNumber,
              },
            });

            await this.bot.sendMessage(
              this.adminChatId,
              `📩 Yangi zakaz!\n👤 Foydalanuvchi: ${fullName}\n📞 Telefon: ${phoneNumber}\n🛒 Mahsulot nomi: ${product.title}\n💵 Narx: ${product.price}`,
            );

            await this.bot.sendMessage(
              chatId,
              "✅ Rahmat! Ma'lumotlaringiz yuborildi. Tez orada siz bilan bog'lanamiz.",
            );
          });
        } else {
          await this.bot.sendMessage(chatId, '❌ Bunday mahsulot topilmadi.');
        }
      } else {
        await this.bot.sendMessage(
          chatId,
          "👋 Salom! Mahsulotni ko'rish uchun linkdan foydalaning.",
        );
      }
    });
  }
}
