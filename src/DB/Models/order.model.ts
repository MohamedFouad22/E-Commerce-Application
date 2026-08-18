import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  OrderStatusEnum,
  PaymentMethodEnum,
} from '../../common/enums/user.eums';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Order {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Cart',
    required: true,
  })
  cartId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Coupon',
  })
  couponId!: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
  })
  subTotal!: number;

  @Prop({
    type: Number,
    default: 0,
  })
  discount!: number;

  @Prop({
    type: Number,
    default: 0,
  })
  totalAfterDiscount!: number;

  @Prop({
    type: String,
    enum: {
      values: Object.values(OrderStatusEnum),
      message: 'Value Not Supported',
    },
    default: OrderStatusEnum.PENDING,
  })
  status!: string;

  @Prop({
    type: String,
    enum: {
      values: Object.values(PaymentMethodEnum),
      message: 'Value Not Supported',
    },
    default: PaymentMethodEnum.CASH,
  })
  paymentMethod!: string;

  @Prop({
    type: String,
    required: true,
  })
  address!: string;

  @Prop({
    type: String,
    required: true,
  })
  phone!: string;
}

export const orderSchema = SchemaFactory.createForClass(Order);
export type HOrderDocument = HydratedDocument<Order>;
export const orderModel = MongooseModule.forFeature([
  {
    name: Order.name,
    schema: orderSchema,
  },
]);
