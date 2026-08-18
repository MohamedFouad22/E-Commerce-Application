import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { AuthGuardTsGuard } from '../common/guards/auth.guard';
import type { createCouponDTO } from './dto/coupon.dto';

@Controller('/api/v1/coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('/create-coupon')
  @UseGuards(AuthGuardTsGuard)
  createCoupon(@Body() body: createCouponDTO, @Req() req: any) {
    return this.couponService.createCoupon(body, req);
  }

  @Get('/get-coupons')
  @UseGuards(AuthGuardTsGuard)
  getCoupons() {
    return this.couponService.getCoupons();
  }

  @Get('/get-coupon/:couponId')
  @UseGuards(AuthGuardTsGuard)
  getSpecificCoupon(@Param('couponId') couponId: string) {
    return this.couponService.getSpecificCoupon(couponId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCouponDto: any) {
    return this.couponService.update(+id, updateCouponDto);
  }

  @Delete('/delete-coupon/:couponId')
  @UseGuards(AuthGuardTsGuard)
  deleteCoupon(@Param('couponId') couponId: string) {
    return this.couponService.deleteCoupon(couponId);
  }
}
