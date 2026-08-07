import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { productModel } from '../DB/Models/product.model';
import { JwtModule } from '@nestjs/jwt';
import { userModel } from '../DB/Models/user.model';
import { brandModel } from '../DB/Models/brand.model';
import { categoryModel } from '../DB/Models/category.model';

@Module({
  imports: [
    productModel,
    userModel,
    brandModel,
    categoryModel,
    JwtModule.register({
      secret: process.env.USER_ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: Number(process.env.ACCESS_KEY_EXPIRES_IN) },
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
