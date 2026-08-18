import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { JwtModule } from '@nestjs/jwt';
import { userModel } from '../DB/Models/user.model';
import { couponModel } from '../DB/Models/coupon.model';

@Module({
  imports: [JwtModule, userModel, couponModel],
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule {}
