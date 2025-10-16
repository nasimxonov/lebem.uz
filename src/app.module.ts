import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { CoreModule } from './core/core.module';
import { ContactModule } from './modules/cantact/contact.module';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoryModule,
    ContactModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
