import {
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private logger = new Logger(PrismaService.name);
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.error('Database connection error');
  }
}
