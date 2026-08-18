import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { Connection } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandController } from './brand/brand.controller';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { CouponModule } from './coupon/coupon.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve('./config/.env.dev'),
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI as string, {
      serverSelectionTimeoutMS: 5000,
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () =>
          console.log('DB Connected Successfully 💯'),
        );
      },
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    BrandModule,
    CategoryModule,
    CouponModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController, BrandController],
  providers: [AppService],
})
export class AppModule {}
