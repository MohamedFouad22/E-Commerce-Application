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
import { OrderService } from './order.service';
import type { createOrderDTO } from './dto/order.dto';
import { AuthGuardTsGuard } from '../common/guards/auth.guard';
import { Types } from 'mongoose';
import type { HUserDocument } from '../DB/Models/user.model';

@Controller('/api/v1/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create-order')
  @UseGuards(AuthGuardTsGuard)
  createOrder(@Body() body: createOrderDTO, @Req() req: any) {
    return this.orderService.createOrder(body, req);
  }

  @Post('/create-session/:orderId')
  @UseGuards(AuthGuardTsGuard)
  async createSession(
    @Param('orderId') orderId: Types.ObjectId,
    @Req() req: any,
    user: HUserDocument,
  ) {
    const session = await this.orderService.createSession(orderId, req, user);
    return session;
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: any) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
