import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FilesUploadDto } from './dtos/files-upload.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('/api/uploads')
export class UploadsController {

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FilesUploadDto, 
    
     description: 'Multiple files upload' })
  public uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0)
      throw new BadRequestException('no file uploaded');

    console.log(files);
    return { message: 'file uploaded successfully' };
  }

  @Get(':image')
  public showImageUploaded(
    @Param('image') image: string,
    @Res() res: Response,
  ) {
    return res.sendFile(image, { root: 'images' });
  }
}
