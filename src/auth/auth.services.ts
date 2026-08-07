import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HUserDocument, User } from '../DB/Models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { compareData, hashData } from '../common/utils/Hashing/hashing';
import { HOtpDocument, Otp } from '../DB/Models/otp.model';
import { generateOtp } from '../common/utils/Security/generate.otp,utils';
import { providerEnum, SubjectEnum } from '../common/enums/user.eums';
import { generateToken } from '../common/utils/Token/generate.token.utils';
import { Secret } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import {
  confirmEmailDTO,
  createUserDTO,
  loginSchemaDTO,
  resendOTPDTO,
} from './dto/auth.dto';

@Injectable()
export class AuthServices {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<HUserDocument>,
    @InjectModel(Otp.name) private readonly OtpModel: Model<HOtpDocument>,
  ) {}

  async createOTP(userId: Types.ObjectId) {
    try {
      const checUser = await this.OtpModel.findOne({ createdBy: userId });

      if (checUser) {
        throw new ConflictException(
          'Already Have Available Otp , Please Try Again later',
        );
      } else {
        await this.OtpModel.create([
          {
            createdBy: userId,
            OTP_Code: generateOtp(),
            ExpiresIn: new Date(Date.now() + 5 * 60 * 1000),
            OTP_Subject: SubjectEnum.CONFIRM_EMAIL,
          },
        ]);
      }
    } catch (error) {
      throw new BadRequestException(
        'Already Have Available Otp , Please Try Again later',
      );
    }
  }

  async signup(body: createUserDTO) {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      age,
      phone,
      gender,
      role,
    } = body;

    const checkUser = await this.userModel.findOne({
      email,
    });
    if (checkUser) throw new ConflictException('User Already Exists');

    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: await hashData(password),
      age,
      phone,
      gender,
      role,
    });
    if (!user) throw new BadRequestException('Failed To Signup');

    await this.createOTP(user._id);

    return { message: 'User Created Successfully', user };
  }

  async resendOtp(body: resendOTPDTO) {
    const { email } = body;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.createOTP(user._id);

    return { message: 'Resend Otp Successfully' };
  }

  async confirmEmail(body: confirmEmailDTO) {
    const { email, otp } = body;

    const checkUser = await this.userModel.findOne({
      email,
      confirmEmailAt: { $exists: false },
    });
    if (!checkUser)
      throw new BadRequestException('User Not Found Or Email Already Exists');

    const checkOtp = await this.OtpModel.findOne({
      createdBy: checkUser._id,
    });
    if (!checkOtp) throw new BadRequestException('Not Found Otp');

    if (!(await compareData(otp, checkOtp.OTP_Code))) {
      throw new BadRequestException('Invalid Otp');
    } else {
      await this.userModel.findOneAndUpdate(
        { email },
        {
          confirmEmailAt: new Date(),
          $inc: { __v: 1 },
        },
      );
    }

    return { message: 'Email Confirmed Successfully' };
  }

  async login(body: loginSchemaDTO) {
    const { email, password } = body;

    const checkUser = await this.userModel.findOne({
      email,
      confirmEmailAt: { $exists: true },
      provider: providerEnum.SYSTEM,
    });
    if (!checkUser) throw new NotFoundException('Invalid Data');

    if (!(await compareData(password, checkUser.password)))
      throw new BadRequestException('Invalid Password');

    const accessToken = await generateToken({
      payload: { email, userName: checkUser.userName },
      secretKey: process.env.USER_ACCESS_TOKEN_SECRET_KEY as Secret,
      options: {
        expiresIn: Number(process.env.ACCESS_KEY_EXPIRES_IN),
        jwtid: uuid(),
      },
    });

    const refreshToken = await generateToken({
      payload: { email, userName: checkUser.userName },
      secretKey: process.env.USER_REFRESH_TOKEN_SECRET_KEY as Secret,
      options: {
        expiresIn: Number(process.env.REFRESH_KEY_EXPIRES_IN),
        jwtid: uuid(),
      },
    });

    return {
      message: 'Login Successfully',
      credentials: { accessToken, refreshToken },
    };
  }
}
