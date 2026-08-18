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

@Controller('/api/v1/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create-order')
  @UseGuards(AuthGuardTsGuard)
  createOrder(@Body() body: createOrderDTO, @Req() req: any) {
    return this.orderService.createOrder(body, req);
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
