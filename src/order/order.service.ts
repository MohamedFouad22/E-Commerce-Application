import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createOrderDTO } from './dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon, HCouponDocument } from '../DB/Models/coupon.model';
import { Model, Types } from 'mongoose';
import { Cart, HCartDocument } from '../DB/Models/cart.model';
import { HOrderDocument, Order } from '../DB/Models/order.model';
import { OrderStatusEnum, PaymentMethodEnum } from '../common/enums/user.eums';
import type { HUserDocument } from '../DB/Models/user.model';
import { PaymentService } from '../common/services/payment/payment.service';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<HCouponDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: Model<HCartDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<HOrderDocument>,
    private PaymentService: PaymentService,
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

  async createSession(
    orderId: Types.ObjectId,
    req: any,
    user: HUserDocument,
  ): Promise<{ message: string; session: Stripe.Checkout.Session }> {
    const userId = req.user.id;
    const checkOrder = await this.orderModel
      .findOne({
        _id: orderId,
        userId,
        status: OrderStatusEnum.PENDING,
        paymentMethod: PaymentMethodEnum.CARD,
      })
      .populate([{ path: 'userId' }, { path: 'cartId' }, { path: 'couponId' }]);
    if (!checkOrder)
      throw new NotFoundException('Order Not Found Or Invalid Data');

    const amount = checkOrder.totalAfterDiscount ?? checkOrder.subTotal ?? 0;
    const line_items = [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: `Order by ${(checkOrder.userId as unknown as HUserDocument).firstName}`,
            description: `Payment For Order On Address ${checkOrder.address}`,
          },
          unit_amount: checkOrder.totalAfterDiscount * 100,
        },
        quantity: 1,
      },
    ];

    const session = await this.PaymentService.createSession({
      success_url: process.env.SUCCESS_URL as string,
      cancel_url: process.env.CANCEL_URL as string,
      metadata: { orderId: orderId.toString() },
      line_items: line_items,
      mode: 'payment',
      customer_email: req.user.email,
      discounts: [],
    });

    return { message: 'Session Created Successfully', session };
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
