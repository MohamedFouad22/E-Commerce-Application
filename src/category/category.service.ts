import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, HCategoryDocument } from '../DB/Models/category.model';
import { Model, Types } from 'mongoose';
import { createCategoryDTO, updateCategoryDTO } from './dto/category.dto';
import { HUserDocument, User, userModel } from '../DB/Models/user.model';
import { Brand, HBrandDocument } from '../DB/Models/brand.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<HCategoryDocument>,
    @InjectModel(Brand.name) private brandModel: Model<HBrandDocument>,
    @InjectModel(User.name) private userModel: Model<HUserDocument>,
  ) {}

  async createCategory(body: createCategoryDTO, req: any) {
    const { name, discription, createdBy, images, brands } = body;

    const checkUser = await this.userModel.findOne({ _id: req.user.id });
    if (!checkUser) throw new NotFoundException('Invalid Data');

    const checkCategory = await this.categoryModel.findOne({ name });
    if (checkCategory) throw new ConflictException('Category Already Exists');

    if (brands && brands.length > 0) {
      const checkValidIds = brands.find((id) => !Types.ObjectId.isValid(id));
      if (checkValidIds) throw new BadRequestException('Invalid Brand');
    }

    const checkBrand = await this.brandModel.find({
      _id: { $in: brands },
    });
    if (checkBrand.length !== brands.length)
      throw new NotFoundException('Missing Brands IDs');

    const category = await this.categoryModel.create({
      name,
      discription,
      createdBy: req.user.id,
      images: req.file.filename,
      brands,
    });
    if (!category) throw new BadRequestException('Failed To Create Category');

    return { message: 'Category Added Successfully' };
  }

  async findAll() {
    const categories = await this.categoryModel.find();

    return { message: 'Find All Categories Successfully', categories };
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById({ _id: id });
    if (!category) throw new BadRequestException('Failed To Get Category');

    return { message: 'Find Category Successfully', category };
  }

  async updateCategory(id: string, req: any, body: updateCategoryDTO) {
    const { name, discription, createdBy, images, brands } = body;

    const checkUser = await this.categoryModel.findOne({
      createdBy: req.user.id,
    });
    if (!checkUser)
      throw new UnauthorizedException(
        'You do not have permission to modify the category',
      );

    const updateCategory = await this.categoryModel.findByIdAndUpdate(
      { _id: id },
      {
        name,
        discription,
        images: req.file && req.file.filename,
        brands,
      },
    );
    if (!updateCategory)
      throw new BadRequestException('Failed To Update Category');

    return { message: 'Category Updated Successfully' };
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
