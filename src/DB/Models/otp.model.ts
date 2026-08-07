import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SubjectEnum } from '../../common/enums/user.eums';
import { HydratedDocument, Types } from 'mongoose';
import { hashData } from '../../common/utils/Hashing/hashing';
import { eventEmitter } from '../../common/utils/Events/sendEmail.event';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Otp {
  @Prop({
    type: Date,
    required: true,
  })
  ExpiresIn!: Date;

  @Prop({
    type: String,
    required: true,
  })
  OTP_Code!: string;

  @Prop({
    type: String,
    enum: { values: Object.values(SubjectEnum) },
    required: true,
  })
  OTP_Subject: string = '';

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  })
  createdBy!: Types.ObjectId;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
export type HOtpDocument = HydratedDocument<Otp>;
export const OtpModel = MongooseModule.forFeature([
  {
    name: Otp.name,
    schema: OtpSchema,
  },
]);

OtpSchema.index({ ExpiresIn: 1 }, { expireAfterSeconds: 0 });

OtpSchema.pre(
  'save',
  async function (this: HOtpDocument & { wasNew: boolean; plainOTP: string }) {
    this.wasNew = this.isNew;
    this.plainOTP = this.OTP_Code;
    this.OTP_Code = await hashData(this.plainOTP);
  },
);

OtpSchema.post('save', async function (doc, next) {
  const that = this as HOtpDocument & { wasNew: boolean; plainOTP: string };

  if (that.wasNew && that.plainOTP) {
    await doc.populate('createdBy');

    const user = doc.createdBy as any;
    await eventEmitter.emit('confirm_email', {
      to: user.email,
      code: that.plainOTP,
      firstName: (that.createdBy as any).userName,
    });
  }
});
