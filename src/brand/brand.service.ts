import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { createBrandDTO, updateBrandDTO } from './dto/brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, HBrandDocument } from '../DB/Models/brand.model';
import { Model } from 'mongoose';
import { HUserDocument, User } from '../DB/Models/user.model';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<HBrandDocument>,
    @InjectModel(User.name) private userModel: Model<HUserDocument>,
  ) {}

  async createBrand(req: any, body: createBrandDTO) {
    const { name, rate, overview, images } = body;

    const checkProduct = await this.brandModel.findOne({
      name,
    });
    if (checkProduct)
      throw new BadRequestException(
        'This product already exists , Please choose another name',
      );

    const createProduct = await this.brandModel.create({
      name,
      createdBy: req.user._id,
      rate,
      images: req.file.filename,
      overview,
    });
    if (!createProduct)
      throw new BadRequestException('Failed To Create Product');

    return { message: 'Product Created Successfully' };
  }

  async updateBrand(body: updateBrandDTO, req: any, Query: { slug: string }) {
    const { name, images, overview } = body;
    const { slug } = Query;

    const checkAuthorizedUser = await this.userModel.findById({
      _id: req?.user?.id,
    });
    if (!checkAuthorizedUser)
      throw new UnauthorizedException(
        'You do not have authorization to renew the product',
      );

    const updateBrand = await this.brandModel.findOneAndUpdate(
      { slug },
      {
        name,
        images: req.file && req.file.filename,
        overview,
      },
    );
    if (!updateBrand)
      throw new NotFoundException('Brand Not Found Or Invalid Data');

    return { message: 'Product Updated Successfully' };
  }

  async findOne(Query: { slug: string }) {
    const { slug } = Query;

    const brand = await this.brandModel.findOne({ slug });
    if (!brand) throw new NotFoundException('Brand Not Found');

    return { message: 'Get Brand Successfully', data: { brand: brand.name } };
  }

  async findAll() {
    const brands = await this.brandModel.find();
    if (!brands.length) {
      return { message: 'Not Found Brands' };
    } else if (!brands) {
      throw new BadRequestException('Failed To Find Brands');
    }

    return { message: 'Get All Brands Successfully', brands };
  }

  async deleteBrand(Param: { id: string }, req: any) {
    const { id } = req.params;

    const checkUser = await this.userModel.findOne({
      _id: req.user.id,
    });
    if (!checkUser)
      throw new UnauthorizedException(
        'You do not have authorization to renew the product',
      );

    const brand = await this.brandModel.findOneAndDelete({ _id: id });
    if (!brand) throw new BadRequestException('Failed To Delete Brand');

    return { message: 'Delete Brand Successfully' };
  }
}
