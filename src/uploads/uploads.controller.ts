import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { diskStorage } from "multer";
import { In } from "typeorm";

@Controller('/api/uploads')
export class UploadsController {

     @Post()
      @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './images',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const originalName = file.originalname;
                const fileExtension = originalName.substring(originalName.lastIndexOf('.'));
                cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
            },
            
        }),
        fileFilter: (req, file, cb) => {
            if(file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new BadRequestException('Only image files are allowed!'), false);
            }
        },
        limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB limit
    }))
    public uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('no file uploaded');

        console.log(file);
        return { message: 'file uploaded successfully' };
    }

    @Get(':image')
    public showImageUploaded(@Param('image') image: string, @Res() res: Response) {
        return res.sendFile(image, { root: 'images' });
    }

}