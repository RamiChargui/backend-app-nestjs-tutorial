import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/utils/user_role";

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);