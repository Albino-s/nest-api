import {
  Controller,
  Get,
  Post,
  Body,
  Logger,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards, BadRequestException, UnauthorizedException, UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('photos')
export class PhotosController {

  constructor() {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file',
    {
      storage: diskStorage({
        destination: './avatars',
        filename: (req, file, cb) => {
          console.log("file", file);
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        return cb(null, `${randomName}${extname(file.originalname)}`)
      }
      })
    }
  ))
  uploadFile(@UploadedFile() file, @Req() req) {
    console.log("req.body", req.body);
    console.log("req.file", req.file);
    console.log("FILE!!!!!!!!!!!!!!!!", file);
  }

  // uploadAvatar(@Param('userid') userId, @UploadedFile() file) {
  //     this.userService.setAvatar(Number(userId), `${this.SERVER_URL}${file.path}`);
  // }


}
