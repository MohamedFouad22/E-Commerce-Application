import { Injectable, NotFoundException } from '@nestjs/common';
import { createCartDTO } from './dto/cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../DB/Models/cart.model';
import { Model, Types } from 'mongoose';
import { Product } from '../DB/Models/product.model';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
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

  findOne() {
    return `This action returns a  cart`;
  }

  update(id: number, updateCartDto: any) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
