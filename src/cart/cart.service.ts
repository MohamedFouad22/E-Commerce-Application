import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createCartDTO, updateProductDTO } from './dto/cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../DB/Models/cart.model';
import { Model, Types } from 'mongoose';
import { Product } from '../DB/Models/product.model';
import { Coupon } from '../DB/Models/coupon.model';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
  ) {}

  async addToCart(body: createCartDTO, req: any) {
    const { userId, productId, quantity } = body;

    const product = await this.productModel.findById(
      new Types.ObjectId(productId),
    );
    if (!product) throw new NotFoundException('Product Not Found');

    const price = product?.discountPrice;
    const totalPrice = price ? quantity * price : undefined;

    let checkCart = await this.cartModel.findOne({ userId: req.user.id });
    if (!checkCart) {
      checkCart = await this.cartModel.create({
        userId: req.user.id,
        items: [{ productId, quantity, price, total: totalPrice }],
        subTotal: totalPrice,
      });
    } else {
      const checkItem = checkCart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (checkItem > -1) {
        checkCart.items[checkItem].quantity += quantity;
        checkCart.items[checkItem].total =
          checkCart.items[checkItem].quantity *
          checkCart.items[checkItem].price;
      } else {
        checkCart.items.push({
          productId: new Types.ObjectId(productId),
          quantity,
          price: Number(price),
          total: totalPrice as number,
        });
      }
    }
    checkCart.subTotal = checkCart.items.reduce(
      (sum, item) => sum + item.total,
      0,
    );

    await checkCart.save();

    return { message: 'Cart Created Successfully', checkCart };
  }

  findAll() {
    return `This action returns all cart`;
  }

  async findCart(req: any) {
    const cart = await this.cartModel
      .findOne({ userId: req.user.id })
      .populate({
        path: 'items.productId',
        select: 'name discountPrice stock',
      });
    if (!cart) throw new NotFoundException('Cart Not Found');

    return { message: 'Find Cart Successfully', cart };
  }

  async updateCart(productId: string, body: updateProductDTO, req: any) {
    const { quantity } = body;

    if (quantity === undefined || typeof quantity !== 'number') {
      throw new BadRequestException('Please provide a valid quantity');
    }

    const userId = req.user?.id || req.user?._id;
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart Not Found');

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Product Not Found');
    } else if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const item = cart.items[itemIndex];
      item.quantity = quantity;
      item.total = item.quantity * item.price;
    }

    cart.subTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
    await cart.save();

    return { message: 'Updated Product Successfully', cart };
  }

  async clearCart(req: any) {
    const userId = req.user.id;
    const cart = await this.cartModel.findOneAndDelete({
      userId,
    });
    if (!cart) throw new NotFoundException('Cart Not Found Or Failed To Clear');

    return { message: 'Clear Cart Successfully' };
  }

  async removeFromCart(req: any, productId: string) {
    const userId = req.user.id;
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart Not Found');

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Product Not Found');
    } else {
      cart.items.splice(itemIndex, 1);
    }

    if (cart.items.length === 0) {
      await this.cartModel.deleteOne({ userId });
    } else {
      cart.subTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
      await cart.save();
    }

    return { message: 'Remove Product Done Successfully' };
  }

  async applyCoupon(req: any, body: { code: string }) {
    const { code } = body;
    const userId = req.user.id || req.user._id;

    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart Not Found');

    const coupon = await this.couponModel.findOne({ code: code.toUpperCase() });
    if (!coupon) throw new NotFoundException('Coupon Not Found');

    if (coupon.expiresIn < new Date()) {
      throw new BadRequestException('Coupon Expired');
    }

    const discount = (cart.subTotal * coupon.discount) / 100;
    const totalAfterDiscount = cart.subTotal - discount;

    cart.coupon = coupon._id;

    cart.discount = discount;

    cart.priceAfterDiscount = totalAfterDiscount;

    await cart.save();

    return { message: 'Coupon Applied Successfully' };
  }
}
