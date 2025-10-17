import { Controller, Get, UseGuards } from '@nestjs/common';
import { BotService } from './bot.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TelegramUserDto } from './dto/telegram-user.dto';

@Controller()
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
}
