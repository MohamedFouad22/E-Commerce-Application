import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthServices } from './auth.services';
import type {
  confirmEmailDTO,
  createUserDTO,
  loginSchemaDTO,
  resendOTPDTO,
} from './dto/auth.dto';
import { LoggerInterceptor } from '../common/interceptor/logger.interceptor';
import { ResponseInterceptor } from '../common/interceptor/response.interceptor';

@UseInterceptors(LoggerInterceptor, ResponseInterceptor)
@Controller('api/v1/auth')
export class AuthController {
  constructor(protected readonly authServices: AuthServices) {}

  @Post('/signup')
  signup(@Body() body: createUserDTO) {
    return this.authServices.signup(body);
  }

  @Post('/resend-otp')
  resendOtp(@Body() body: resendOTPDTO) {
    return this.authServices.resendOtp(body);
  }

  @Patch('/confirm-email')
  confirmEmail(@Body() body: confirmEmailDTO) {
    return this.authServices.confirmEmail(body);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: loginSchemaDTO) {
    return this.authServices.login(body);
  }
}
