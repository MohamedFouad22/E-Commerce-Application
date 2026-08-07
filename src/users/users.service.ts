import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HUserDocument, User } from '../DB/Models/user.model';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<HUserDocument>,
  ) {}

  async getProfile(req: any) {
    return { message: 'Get Profile Successfully', data: { user: req.user } };
  }

  async uploadLocalFile(req: any) {
    return { message: 'Upload File Local Successfully' };
  }
}
