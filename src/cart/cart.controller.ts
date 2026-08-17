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
import type { createCartDTO } from './dto/cart.dto';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: any) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
