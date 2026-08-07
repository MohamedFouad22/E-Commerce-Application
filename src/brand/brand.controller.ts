import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import type { createBrandDTO, updateBrandDTO } from './dto/brand.dto';
import { AuthGuardTsGuard } from '../common/guards/auth.guard';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  storageApproachEnum,
  uploadLocalFile,
  validationTypeEnum,
} from '../common/multer/multer';

@Controller('api/v1/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post('/create-brand')
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
  createBrand(@Req() req: Request, @Body() body: createBrandDTO) {
    return this.brandService.createBrand(req, body);
  }

  @Patch('/update-brand')
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
  updateBrand(
    @Body() body: updateBrandDTO,
    @Req() req: any,
    @Query() Query: { slug: string },
  ) {
    return this.brandService.updateBrand(body, req, Query);
  }

  @Get('/get-brand')
  findOne(@Query() Query: { slug: string }) {
    return this.brandService.findOne(Query);
  }

  @Get('/get-all-brands')
  findAll() {
    return this.brandService.findAll();
  }

  @Delete('/delete-brand/:id')
  @UseGuards(AuthGuardTsGuard)
  deleteBrand(@Param('/:id') Param: { id: string }, @Req() req: any) {
    return this.brandService.deleteBrand(Param, req);
  }
}
