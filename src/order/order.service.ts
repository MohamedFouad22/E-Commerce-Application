import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createOrderDTO } from './dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon, HCouponDocument } from '../DB/Models/coupon.model';
import { Model } from 'mongoose';
import { Cart, HCartDocument } from '../DB/Models/cart.model';
import { HOrderDocument, Order } from '../DB/Models/order.model';
import { OrderStatusEnum, PaymentMethodEnum } from '../common/enums/user.eums';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<HCouponDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: Model<HCartDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<HOrderDocument>,
  ) {}

  async createOrder(body: createOrderDTO, req: any) {
    const userId = req.user.id;
    const { address, phone, cartId } = body;

    const cart = await this.cartModel
      .findOne({ _id: cartId })
      .populate({ path: 'coupon' });
    if (!cart) throw new NotFoundException('Cart Not Found');

    const order = await this.orderModel.create({
      userId,
      cartId: cart._id,
      couponId: cart.coupon,
      subTotal: cart.subTotal,
      discount: cart.discount || 0,
      totalAfterDiscount: cart.priceAfterDiscount || cart.subTotal,
      status: OrderStatusEnum.PENDING,
      paymentMethod: PaymentMethodEnum.CASH,
      address,
      phone,
    });

    if (!order) throw new BadRequestException('Failed To Complete Order');

    cart.items = [];
    await cart.save();

    return { message: 'Order Created Successfully', order };
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: any) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
