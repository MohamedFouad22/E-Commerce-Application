import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Brand {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: 50,
    minLength: 3,
  })
  name: string = '';

  @Prop({
    type: String,
    required: true,
  })
  slug!: string;

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
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  })
  rate!: number;

  @Prop({
    type: String,
    minLength: 3,
    maxLength: 5000,
    required: true,
  })
  overview: string = '';
}

export const brandSchema = SchemaFactory.createForClass(Brand);
export type HBrandDocument = HydratedDocument<Brand>;
brandSchema.pre('validate', async function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, trim: true });
  }
});
export const brandModel = MongooseModule.forFeature([
  {
    name: Brand.name,
    schema: brandSchema,
  },
]);
