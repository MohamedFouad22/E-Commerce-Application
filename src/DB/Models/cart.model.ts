import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Cart {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  })
  userId!: Types.ObjectId;

  @Prop([
    {
      productId: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        min: 1,
        required: true,
      },
      price: {
        type: Number,
        min: 0,
        required: true,
      },
      total: {
        type: Number,
        min: 0,
        required: true,
      },
    },
  ])
  items!: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
    total: number;
  }[];

  @Prop({
    type: Number,
    required: true,
  })
  subTotal!: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'Coupon',
  })
  coupon?: Types.ObjectId;

  @Prop({
    type: Number,
    default: 0,
  })
  discount!: number;

  @Prop({
    type: Number,
    required: function (this: Cart) {
      this.coupon ? true : false;
    },
  })
  priceAfterDiscount?: number;
}
export const cartSchema = SchemaFactory.createForClass(Cart);
export type HCartDocument = HydratedDocument<Cart>;
cartSchema.pre('validate', function () {
  if (this.isModified('items')) {
    this.items.forEach((item) => {
      item.total = item.price * item.quantity;
    });
  }
});
export const cartModel = MongooseModule.forFeature([
  {
    name: Cart.name,
    schema: cartSchema,
  },
]);
