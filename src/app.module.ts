import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { CoreModule } from './core/core.module';
import { ContactModule } from './modules/contact/contact.module';
import { BotModule } from './modules/bot/bot.module';

@Module({
  imports: [CoreModule, UsersModule, AuthModule, ProductsModule, CategoryModule, ContactModule, BotModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
