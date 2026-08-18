import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Coupon {
  @Prop({
    type: String,
    trim: true,
    unique: true,
    required: true,
  })
  code: string = '';

  @Prop({
    type: Date,
    required: true,
  })
  expiresIn!: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy!: Types.ObjectId;

  @Prop({
    type: Number,
    min: 1,
    max: 100,
    required: true,
  })
  discount!: number;
}

export const couponSchema = SchemaFactory.createForClass(Coupon);
export type HCouponDocument = HydratedDocument<Coupon>;
export const couponModel = MongooseModule.forFeature([
  {
    name: Coupon.name,
    schema: couponSchema,
  },
]);
