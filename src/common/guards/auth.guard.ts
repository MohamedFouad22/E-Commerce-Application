import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HUserDocument, User, userModel } from '../../DB/Models/user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuardTsGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<HUserDocument>,
    private JwtServices: JwtService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Missing Authorized');

    const token = authHeader.split(' ')[1];
    if (!token) throw new BadRequestException('Invalid Token Format');

    const payload = this.JwtServices.verify(token, {
      secret: process.env.USER_ACCESS_TOKEN_SECRET_KEY as string,
    });

    const user = await this.userModel.findOne({
      email: payload.email,
    });
    if (!user) throw new NotFoundException('User Not Found');
    request.user = user;

    return true;
  }
}
