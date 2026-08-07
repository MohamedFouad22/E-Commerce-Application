import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { brandModel } from '../DB/Models/brand.model';
import { userModel } from '../DB/Models/user.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, brandModel, userModel],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],
})
export class BrandModule {}
