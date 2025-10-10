import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Req() req) {
    return this.usersService.getMe(req.user);
  }
}
