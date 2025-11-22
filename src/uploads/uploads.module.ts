import { BadRequestException, Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Module({
    controllers: [UploadsController],
    imports: [MulterModule.register(
        {
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
            if(file.mimetype.startsWith('image')) {
                cb(null, true);
            } else {
                cb(new BadRequestException('Only image files are allowed!'), false);
            }
        },
        limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB limit
    }
    )],
})
export class UploadsModule {}