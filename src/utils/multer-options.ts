import { extname } from 'path';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.match('/(jpg|jpeg|png|gif)$')) {
      return cb(
        new HttpException('Images are only allowed', HttpStatus.BAD_REQUEST),
        false,
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
};
