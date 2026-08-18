import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createCouponDTO } from './dto/coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, HCouponDocument } from '../DB/Models/coupon.model';
import { HUserDocument, User } from '../DB/Models/user.model';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<HCouponDocument>,
    @InjectModel(User.name) private readonly userModel: Model<HUserDocument>,
  ) {}

  async createCoupon(body: createCouponDTO, req: any) {
    const { code, discount, expiresIn } = body;
    const userId = req.user.id || req.user._id;

    const checkCoupon = await this.couponModel.findOne({ code });
    if (checkCoupon) throw new ConflictException('Coupon Already Exists');

    const coupon = await this.couponModel.create({
      code: code.toUpperCase(),
      discount,
      createdBy: userId,
      expiresIn,
    });

    return { message: 'Coupon Created Successfully', coupon };
  }

  async getCoupons() {
    const coupons = await this.couponModel.find({});
    if (coupons.length === 0) {
      return { message: 'There are no coupons currently available' };
    }
    return { message: 'Get Coupons Successfully', coupons };
  }

  async getSpecificCoupon(couponId: string) {
    const coupon = await this.couponModel.findOne({ _id: couponId });
    if (!coupon)
      throw new NotFoundException('Coupon Not Found Or Invalid Coupon');
    return { message: 'Get Coupon Successfully', coupon };
  }

  update(id: number, updateCouponDto: any) {
    return `This action updates a #${id} coupon`;
  }

  async deleteCoupon(couponId: string) {
    const coupon = await this.couponModel.findByIdAndDelete({ _id: couponId });
    if (!coupon)
      throw new BadRequestException(
        'Failed To Delete Coupon Or Invalid Coupon',
      );
    return { message: 'Delete Coupon Successfully', coupon };
  }
}
