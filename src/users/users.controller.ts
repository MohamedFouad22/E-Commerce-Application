import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuardTsGuard } from '../common/guards/auth.guard';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  storageApproachEnum,
  uploadLocalFile,
  validationTypeEnum,
} from '../common/multer/multer';

@Controller('/api/v1/user')
export class UsersController {
  constructor(protected readonly userServices: UsersService) {}

  @Get('/get-profile')
  @UseGuards(AuthGuardTsGuard)
  getProfile(@Req() req: any) {
    return this.userServices.getProfile(req);
  }

  @Post('/upload-local-file')
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
  async uploadLocalFile(@UploadedFile() file: Express.Multer.File) {
    return await this.userServices.uploadLocalFile(file);
  }
}
