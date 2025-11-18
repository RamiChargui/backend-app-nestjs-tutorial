import { createParamDecorator } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { JwtPayload } from "src/utils/types";

export const currentUser = createParamDecorator(
    (data, context: ExecutionContextHost) => {
        const request = context.switchToHttp().getRequest();
        const user: JwtPayload= request['user'];
        return user;
    }
)