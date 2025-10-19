import { Body, Controller, Get, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { BotService } from './bot.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TelegramUserDto } from './dto/telegram-user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createMulterOptions } from 'src/common/utils/upload.utils';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('bot')
@ApiBearerAuth()
@ApiTags('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Get('users')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: TelegramUserDto, isArray: true })
  async getUsers(): Promise<TelegramUserDto[]> {
    return await this.botService.findAll();
  }

  @Post('send-message')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 5, createMulterOptions('./uploads/message-images', true)))
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async sendMessage(@Body() body: SendMessageDto, @UploadedFiles() files: Express.Multer.File[]) {
    return await this.botService.queueMessage(body, files ?? []);
  }
}
