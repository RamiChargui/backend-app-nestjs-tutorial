import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

@Controller('/api/uploads')
export class UploadsController {

     @Post()
      @UseInterceptors(FilesInterceptor('files'))
    public uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
        if (!files || files.length===0) 
            throw new BadRequestException('no file uploaded');

        console.log(files);
        return { message: 'file uploaded successfully' };
    }

    @Get(':image')
    public showImageUploaded(@Param('image') image: string, @Res() res: Response) {
        return res.sendFile(image, { root: 'images' });
    }

}