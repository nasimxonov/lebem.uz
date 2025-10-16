import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(username: string, password: string) {
    try {
      const user = await this.prisma.users.findUnique({ where: { username } });
      if (!user) throw new NotFoundException('User not found');

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new UnauthorizedException('Password incorrect');

      const token = await this.jwt.signAsync({
        id: user.id,
        username: user.username,
        role: 'user',
      });

      return { message: 'Login successfully', token };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      console.error('Login error:', error);
      throw new InternalServerErrorException('Login failed');
    }
  }
}
