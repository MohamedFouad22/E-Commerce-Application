import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import type {
  createCartDTO,
  updateProductDTO,
  updateProductParamDTO,
} from './dto/cart.dto';
import { AuthGuardTsGuard } from '../common/guards/auth.guard';

@Controller('api/v1/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add-to-cart')
  @UseGuards(AuthGuardTsGuard)
  addToCart(@Body() body: createCartDTO, @Req() req: any) {
    return this.cartService.addToCart(body, req);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get('/get-cart')
  @UseGuards(AuthGuardTsGuard)
  findCart(@Req() req: any) {
    return this.cartService.findCart(req);
  }

  @Patch('/update-cart/:protucdId')
  @UseGuards(AuthGuardTsGuard)
  update(
    @Param('protucdId') productId: string,
    @Body() body: updateProductDTO,
    @Req() req: any,
  ) {
    return this.cartService.updateCart(productId, body, req);
  }

  @Post('/apply-coupon')
  @UseGuards(AuthGuardTsGuard)
  applyCoupon(@Req() req: any, @Body() body: { code: string }) {
    return this.cartService.applyCoupon(req, body);
  }

  @Delete('/clear-cart')
  @UseGuards(AuthGuardTsGuard)
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req);
  }

  @Delete('/remove-from-cart/:productId')
  @UseGuards(AuthGuardTsGuard)
  removeFromCart(@Req() req: any, @Param('productId') productId: string) {
    return this.cartService.removeFromCart(req, productId);
  }
}
