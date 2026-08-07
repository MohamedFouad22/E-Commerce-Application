import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { categoryModel } from '../DB/Models/category.model';
import { userModel } from '../DB/Models/user.model';
import { JwtModule } from '@nestjs/jwt';
import { brandModel } from '../DB/Models/brand.model';

@Module({
  imports: [
    categoryModel,
    userModel,
    brandModel,
    JwtModule.register({
      secret: process.env.USER_ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: Number(process.env.ACCESS_KEY_EXPIRES_IN) },
    }),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
