import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HProductDocument, Product } from '../DB/Models/product.model';
import { Model } from 'mongoose';
import { ICreateProductDTO } from './dto/product.dto';
import { HUserDocument, User } from '../DB/Models/user.model';
import { Category, HCategoryDocument } from '../DB/Models/category.model';
import { Brand, HBrandDocument } from '../DB/Models/brand.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<HProductDocument>,
    @InjectModel(User.name) private userModel: Model<HUserDocument>,
    @InjectModel(Brand.name) private brandModel: Model<HBrandDocument>,
    @InjectModel(Category.name) private categoryModel: Model<HCategoryDocument>,
  ) {}

  async createProduct(body: ICreateProductDTO, req: any) {
    const {
      name,
      slug,
      rate,
      overview,
      images,
      brand,
      category,
      originalPrice,
      discountPercentage,
      discountPrice,
      stock,
      soldItems,
      createdBy,
    } = body;

    const checkProduct = await this.productModel.findOne({ slug });
    if (checkProduct) throw new ConflictException('Product Already Exists');

    const checkAuthUser = await this.userModel.findOne({ _id: req.user._id });
    if (!checkAuthUser) throw new UnauthorizedException('Missing Authorized');

    const checkBrand = await this.brandModel.findOne({ name: brand });
    if (!checkBrand) throw new NotFoundException('Brand Not Found');

    const checkCategory = await this.categoryModel.findOne({ name: category });
    if (!checkCategory) throw new NotFoundException('Category Not Found');

    const files = req.files as Express.Multer.File[];
    const product = await this.productModel.create({
      name,
      rate,
      overview,
      images: files.map((file) => file.filename),
      brand,
      category,
      originalPrice,
      discountPercentage,
      discountPrice,
      stock,
      soldItems,
      createdBy: req.user._id,
    });
    if (!product) throw new BadRequestException('Failed To Create Product');

    return { message: 'Create Product Successfully', product };
  }

  async getAllProducts() {
    const products = await this.productModel.find();
    if (!products) throw new NotFoundException('Products Not Found');

    return { message: 'Get All Product Successfully', products };
  }

  async findOne(id: string) {
    const product = await this.productModel.findOne({
      _id: id,
    });
    if (!product) throw new NotFoundException('Product Not Found');
    return { message: 'Get Specific Product Successfully', product };
  }

  update(id: number) {
    console.log();

    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
