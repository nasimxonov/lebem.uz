import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { UpdatePasswordDTO } from './dto/update-password.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Req() req: Request) {
    return this.usersService.getMe(req['user']);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  changePassword(@Req() request: any, @Body() body: UpdatePasswordDTO) {
    return this.usersService.changePassword(request['user'], body);
  }
}
