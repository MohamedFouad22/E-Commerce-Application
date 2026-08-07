import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import type { ICreateProductDTO } from './dto/product.dto';
import { AuthGuardTsGuard } from '../common/guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  storageApproachEnum,
  uploadLocalFile,
  validationTypeEnum,
} from '../common/multer/multer';

@Controller('api/v1/product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/create-product')
  @UseGuards(AuthGuardTsGuard)
  @UseInterceptors(
    FilesInterceptor(
      'files',
      5,
      uploadLocalFile({
        storageApproach: storageApproachEnum.DISK,
        maxSize: 5,
        fileValidation: validationTypeEnum.images,
      }),
    ),
  )
  createProduct(@Body() body: ICreateProductDTO, @Req() req: any) {
    return this.productsService.createProduct(body, req);
  }

  @Get('/get-product')
  findAll() {
    return this.productsService.getAllProducts();
  }

  @Get('/get-product/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
