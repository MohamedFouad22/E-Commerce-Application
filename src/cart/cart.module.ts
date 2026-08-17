import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { userModel } from '../DB/Models/user.model';
import { cartModel } from '../DB/Models/cart.model';
import { productModel } from '../DB/Models/product.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [userModel, cartModel, productModel, JwtModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
