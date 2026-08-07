import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, userSchema } from '../DB/Models/user.model';
import { Otp, OtpSchema } from '../DB/Models/otp.model';
import { AuthController } from './auth.controller';
import { AuthServices } from './auth.services';
import { AuthGuardTsGuard } from '../common/guards/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
    JwtModule.register({
      secret: process.env.USER_ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: Number(process.env.ACCESS_KEY_EXPIRES_IN) },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthServices, AuthGuardTsGuard],
  exports: [MongooseModule, JwtModule, AuthGuardTsGuard],
})
export class AuthModule {}
