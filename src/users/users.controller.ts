import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards, ParseIntPipe, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { UserService } from "./services/user.service";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { Roles } from "./decorators/user-role.decorator";
import { UserRole } from "src/utils/user_role";
import { AuthRoleGuard } from "./guards/auth-role.guard";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { AuthService } from "./services/auth.service";

 @Controller("api/users")
export class UsersController{
    constructor(
        private readonly userService: UserService,
    ){}

   @Post("/auth/register")
    public register(@Body() body:RegisterDto){
        return this.userService.register(body);
    }

    @Post("/auth/login")
    @HttpCode(HttpStatus.OK)
    public login(@Body() body:LoginDto){
        return this.userService.login(body);
    }

    @Get("/current-user")
    @UseGuards(AuthGuard)
    public getCurrentUser(@Req() req: any){
        const id = req.user.id;
        console.log('route handler called!');
        return this.userService.getCurrentUser(id);
    }

    @Get()
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthRoleGuard)
    public getAllUsers(){
        return this.userService.getAll();
    }


    @Put("/update")
    @Roles(UserRole.USER, UserRole.ADMIN)
    @UseGuards(AuthRoleGuard)
    public updateUser(@Body() body: UpdateUserDto, @Req() req: any) {
        const id = req.user.id;
        return this.userService.updateUser(id, body);
    }

    @Delete(":id")
    @Roles(UserRole.USER, UserRole.ADMIN)
    @UseGuards(AuthRoleGuard)
    public deleteUser(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
        return this.userService.deleteUser(id, req.user);
    }

}