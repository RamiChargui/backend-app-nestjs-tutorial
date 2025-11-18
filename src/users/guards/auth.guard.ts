import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const [type, token] = request.headers.authorization?.split(" ") ?? [];

        if (token && type == "Bearer") {
            try {
                const payload = await this.jwtService.verifyAsync(
                    token,
                    {
                        secret: this.configService.get<string>("JWT_SECRET"),
                    }
                );
                request["user"] = payload;
                console.log(`user : ${request["user"]}`);
                return true;
            } catch {
                throw new UnauthorizedException(`access denied, Invalid token `);
            }
        } else {
            throw new UnauthorizedException('access denied, token missing');
        }

        
    }
}
