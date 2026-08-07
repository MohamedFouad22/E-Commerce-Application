import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Product {
  @Prop({
    type: String,
    trim: true,
    minLength: 3,
    maxLength: 25,
    required: true,
  })
  name: string = '';

  @Prop({
    type: String,
    trim: true,
    required: true,
  })
  slug: string = '';

  @Prop({
    type: Number,
    default: 0,
  })
  rate!: number;

  @Prop({
    type: String,
    trim: true,
    minLength: 3,
    maxLength: 5000,
  })
  overview: string = '';

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy!: Types.ObjectId;

  @Prop({
    type: [String],
    required: true,
  })
  images!: string[];

  @Prop({
    type: Types.ObjectId,
    ref: 'Brand',
    required: true,
  })
  brand!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category!: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
  })
  originalPrice!: number;

  @Prop({
    type: Number,
    default: 0,
  })
  discountPercentage!: number;

  @Prop({
    type: Number,
    required: true,
  })
  discountPrice!: number;

  @Prop({
    type: Number,
    required: true,
  })
  stock!: number;

  @Prop({
    type: Number,
    default: 0,
  })
  soldItems!: number;
}

export const productSchema = SchemaFactory.createForClass(Product);
export type HProductDocument = HydratedDocument<Product>;
productSchema.pre('validate', async function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, trim: true });
  }
});
export const productModel = MongooseModule.forFeature([
  {
    name: Product.name,
    schema: productSchema,
  },
]);
