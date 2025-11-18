import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { UserRole } from "src/utils/user_role";
import { UserService } from "../services/user.service";

@Injectable()
export class AuthRoleGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly reflector: Reflector,
        private readonly userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles : UserRole[] = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if(!roles || roles.length === 0) return false;

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
                const user = await this.userService.getCurrentUser(payload.id);
                if(!user) return false;
                
                if(roles.includes(user.role)) {
                    request['user'] = payload;
                    return true;
                }
            } catch {
                throw new UnauthorizedException('access denied, Invalid token');
            }
        } else {
            throw new UnauthorizedException('access denied, token missing');
        }

        // If none of the above conditions are met, deny access
        return false;
    }
}
