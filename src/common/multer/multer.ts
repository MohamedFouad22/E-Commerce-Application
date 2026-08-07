import { BadRequestException } from '@nestjs/common';
import multer, { diskStorage } from 'multer';
import { extname } from 'node:path';

export const validationTypeEnum = {
  images: ['image/avif', 'image/gif', 'image/jpeg', 'image/pjpeg', 'image/png'],
  videos: ['video/mp4', 'video/webm'],
  documents: [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
  ],
};

export enum storageApproachEnum {
  MEMORY = 'MEMORY',
  DISK = 'DISK',
}

export const uploadLocalFile = function ({
  storageApproach = storageApproachEnum.DISK,
  maxSize = 5,
  fileValidation = [],
}: {
  storageApproach?: storageApproachEnum;
  maxSize: number;
  fileValidation: string[];
}) {
  if (storageApproach === storageApproachEnum.DISK) {
    const storage = diskStorage({
      destination: './src/uploads/brands',
      filename(req, file, callback) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = extname(file.originalname);
        const fileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
        callback(null, fileName);
      },
    });

    const fileFilter = function (req, file, cb) {
      if (fileValidation.length && !fileValidation.includes(file.mimetype)) {
        cb(new BadRequestException('Invalid File Format'));
      } else {
        cb(null, true);
      }
    };

    return {
      fileFilter,
      storage,
      limits: { fileSize: maxSize * 1024 * 1024 },
    };
  }
};
