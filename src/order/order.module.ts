import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { userModel } from '../DB/Models/user.model';
import { cartModel } from '../DB/Models/cart.model';
import { couponModel } from '../DB/Models/coupon.model';
import { JwtModule } from '@nestjs/jwt';
import { orderModel } from '../DB/Models/order.model';

@Module({
  imports: [userModel, cartModel, couponModel, orderModel, JwtModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
