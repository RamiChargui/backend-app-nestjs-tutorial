import { BadRequestException, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserService } from "./services/user.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./services/auth.service";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { MailModule } from "src/mail/mail.module";

@Module({
    controllers:[UsersController],
    providers: [UserService, AuthService],
    exports: [UserService],
    imports: [
        MailModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    global: true,
                    secret: config.get<string>('JWT_SECRET'),
                    signOptions: { expiresIn: config.get<string>('JWT_EXPIRATION') },
                };
            },
        
            }),
        MulterModule.register(
            {
                    storage: diskStorage({
                        destination: './images/users',
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
        )
    ],
})
export class UsersModule{
}