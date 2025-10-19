import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramService {
  private readonly token = process.env.TELEGRAM_BOT_TOKEN;
  private readonly api = `https://api.telegram.org/bot${this.token}`;

  async sendMessage(chatId: string, text: string, images: string[] = []) {
    if (images.length > 1) {
      // Agar birdan ortiq rasm bo‘lsa — media group yuboramiz
      const media = images.map((img, index) => ({
        type: 'photo',
        media: `https://lebemuz.duckdns.org${img}`,
        ...(index === 0 ? { caption: text } : {}), // caption faqat 1-rasmda bo‘ladi
      }));

      await axios.post(`${this.api}/sendMediaGroup`, {
        chat_id: chatId,
        media,
      });
    } else if (images.length === 1) {
      // Faqat bitta rasm
      await axios.post(`${this.api}/sendPhoto`, {
        chat_id: chatId,
        photo: `https://lebemuz.duckdns.org${images[0]}`,
        caption: text,
      });
    } else {
      // Oddiy text
      await axios.post(`${this.api}/sendMessage`, {
        chat_id: chatId,
        text,
      });
    }
  }
}
