import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserService } from "./services/user.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./services/auth.service";

@Module({
    controllers:[UsersController],
    providers: [UserService, AuthService],
    exports: [UserService],
    imports: [
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
    ],
})
export class UsersModule{
}