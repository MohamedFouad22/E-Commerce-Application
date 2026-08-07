import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Category {
  @Prop({
    type: String,
    minLength: 3,
    maxLength: 50,
    trim: true,
    unique: true,
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
    type: String,
    trim: true,
    minLength: 3,
    maxLength: 5000,
  })
  discription: string = '';

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy!: Types.ObjectId;

  @Prop({
    type: [String],
  })
  images!: string[];

  @Prop({
    type: [Types.ObjectId],
    ref: 'Brand',
    unique: true,
  })
  brands!: Types.ObjectId[];
}

export const categorySchema = SchemaFactory.createForClass(Category);
export type HCategoryDocument = HydratedDocument<Category>;
categorySchema.pre('validate', async function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, trim: true });
  }
});
export const categoryModel = MongooseModule.forFeature([
  {
    name: Category.name,
    schema: categorySchema,
  },
]);
