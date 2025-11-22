import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards, ParseIntPipe, UseInterceptors, ClassSerializerInterceptor, BadRequestException, UploadedFile, Res } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { UserService } from "./services/user.service";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { Roles } from "./decorators/user-role.decorator";
import { UserRole } from "src/utils/user_role";
import { AuthRoleGuard } from "./guards/auth-role.guard";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { AuthService } from "./services/auth.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { currentUser } from "./decorators/current-user.decorator";
import { JwtPayload } from "src/utils/types";
import { Response } from "express";
import { ApiBody, ApiConsumes, ApiSecurity } from "@nestjs/swagger";
import { ImageUploadDto } from "./dtos/image-upload.dto";

 @Controller("api/users")
export class UsersController{
    constructor(
        private readonly userService: UserService,
    ){}

   @Post("/auth/register")
    public register(@Body() body:RegisterDto){
        return this.userService.register(body);
    }

    @Get("/verify-email/:id/:token")
    public verifyEmail(@Param('id', ParseIntPipe) id:number, @Param('token') token:String ){
        return this.userService.activeAccount(id, token);
    }

    @Post("/auth/login")
    @HttpCode(HttpStatus.OK)
    public login(@Body() body:LoginDto){
        return this.userService.login(body);
    }

    @Get("/current-user")
    @UseGuards(AuthGuard)
    @ApiSecurity('bearer')
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
    @ApiSecurity('bearer')
    public updateUser(@Body() body: UpdateUserDto, @Req() req: any) {
        const id = req.user.id;
        return this.userService.updateUser(id, body);
    }

    @Delete(":id")
    @Roles(UserRole.USER, UserRole.ADMIN)
    @UseGuards(AuthRoleGuard)
    @ApiSecurity('bearer')
    public deleteUser(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
        return this.userService.deleteUser(id, req.user);
    }

    @Post("/upload-image")
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('profile-image'))
    @ApiSecurity('bearer')
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: ImageUploadDto, description: 'Profile image upload' })
    public uploadProfileImage(
        @UploadedFile() file: Express.Multer.File,
        @currentUser() payload: JwtPayload){
        if (!file) throw new BadRequestException('no file uploaded');
        return this.userService.updateUserProfileImage(payload.id, file.filename);
    }

    @Delete("/images/remove-profile-image")
    @UseGuards(AuthGuard)
    @ApiSecurity('bearer')
    public removeUserProfileImage(@currentUser() payload: JwtPayload){
        
        return this.userService.removeUserProfileImage(payload.id);
    }

    @Get("/images/:image")
    public showImageProfile(@Param("image") image: string, @Res() res: Response){
        return res.sendFile(image, { root: 'images/users' });
    }

}