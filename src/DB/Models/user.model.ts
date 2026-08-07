import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  genderEnum,
  providerEnum,
  RoleEnum,
} from '../../common/enums/user.eums';
import { hashData } from '../../common/utils/Hashing/hashing';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({
    type: String,
    required: true,
    minLength: 2,
    maxLength: 25,
    trim: true,
    lowercase: true,
  })
  firstName: string = '';

  @Prop({
    type: String,
    required: true,
    minLength: 2,
    maxLength: 25,
    trim: true,
    lowercase: true,
  })
  lastName: string = '';

  @Virtual({
    get: function (this: any) {
      return this.firstName + ' ' + this.lastName;
    },
    set: function (this: any, value: string) {
      const [firstName, lastName] = value.split(' ') || [];
      this.set({ firstName, lastName });
    },
  })
  userName: string = '';

  @Prop({
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: true,
  })
  email: string = '';

  @Prop({
    type: String,
    required: function () {
      return this.provider === 'GOOGLE' ? false : true;
    },
    minLength: 8,
  })
  password: string = '';

  @Prop({
    type: Date,
  })
  confirmEmailAt!: Date;

  @Prop({
    type: Number,
    required: true,
  })
  age!: number;

  @Prop({
    type: String,
  })
  phone: string = '';

  @Prop({
    type: String,
  })
  confirmEmailOTP: string = '';

  @Prop({
    type: String,
    enum: {
      values: Object.values(genderEnum),
      message: `{VALUE} is not supported`,
    },
    default: genderEnum.MALE,
  })
  gender: string = '';

  @Prop({
    type: String,
    enum: {
      values: Object.values(providerEnum),
      message: `{VALUE} is not supported`,
    },
    default: providerEnum.SYSTEM,
  })
  provider: string = '';

  @Prop({
    type: String,
    enum: {
      values: Object.values(RoleEnum),
      message: `{VALUE} is not supported`,
    },
    default: RoleEnum.USER,
  })
  role: string = '';
}

export const userSchema = SchemaFactory.createForClass(User);
export type HUserDocument = HydratedDocument<User>;
export const userModel = MongooseModule.forFeature([
  {
    name: User.name,
    schema: userSchema,
  },
]);

userSchema.pre('save', async function (next) {
  if (this.isModified(this.password)) {
    this.password = await hashData(this.password);
  }
});
