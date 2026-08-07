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
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import type { createCategoryDTO, updateCategoryDTO } from './dto/category.dto';
import { AuthGuardTsGuard } from '../common/guards/auth.guard';
import {
  storageApproachEnum,
  uploadLocalFile,
  validationTypeEnum,
} from '../common/multer/multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create-category')
  @UseGuards(AuthGuardTsGuard)
  @UseInterceptors(
    FileInterceptor(
      'file',
      uploadLocalFile({
        storageApproach: storageApproachEnum.DISK,
        maxSize: 5,
        fileValidation: validationTypeEnum.images,
      }),
    ),
  )
  createCategory(@Body() body: createCategoryDTO, @Req() req: any) {
    return this.categoryService.createCategory(body, req);
  }

  @Get('/find-all-categories')
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('/find-category/:id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
  @Patch('/update-category/:id')
  @UseGuards(AuthGuardTsGuard)
  @UseInterceptors(
    FileInterceptor(
      'file',
      uploadLocalFile({
        storageApproach: storageApproachEnum.DISK,
        maxSize: 5,
        fileValidation: validationTypeEnum.images,
      }),
    ),
  )
  updateCategory(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: updateCategoryDTO,
  ) {
    return this.categoryService.updateCategory(id, req, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
