import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { userModel } from '../DB/Models/user.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    userModel,
    JwtModule.register({
      secret: process.env.USER_ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: Number(process.env.ACCESS_KEY_EXPIRES_IN) },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
