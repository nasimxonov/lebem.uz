import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramService {
  private readonly token = process.env.TELEGRAM_BOT_TOKEN;
  private readonly api = `https://api.telegram.org/bot${this.token}`;

  async sendMessage(chatId: string, text: string, images: string[] = []) {
    // if (images.length > 0) {
    //   for (const img of images) {
    //     await axios.post(`${this.api}/sendPhoto`, {
    //       chat_id: chatId,
    //       photo: `https://yourdomain.com/uploads/${img}`,
    //       caption: text,
    //     });

    //     await new Promise((r) => setTimeout(r, 200));
    //   }
    // } else {

    await axios.post(`${this.api}/sendMessage`, {
      chat_id: chatId,
      text,
    });

    // }
  }
}
