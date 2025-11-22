import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterDto } from "../dtos/register.dto";
import * as bcrypt from 'bcryptjs';
import { LoginDto } from "../dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { AccessToken, JwtPayload } from "src/utils/types";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { UserRole } from "src/utils/user_role";
import { AuthService } from "./auth.service";
import e from "express";
import { join } from "path";
import { unlinkSync } from "fs";

@Injectable()
export class UserService {
    
    
    
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly authService: AuthService,
    ){}


    public async getCurrentUser(id:number){
        const user = await this.userRepository.findOneBy({id});
        if(!user) throw new BadRequestException('user not found');
        return user;
    }

    /**
         * Registers a new user.
         * @param RegisterDto The user registration data.
         * @returns JWT (access token).
         */
        public async register(userdto: RegisterDto) {
            return this.authService.register(userdto);
        }

        public async activeAccount(id: number, token: String) {
            return this.authService.activeAccount(id, token);
        }
    
        public async login(logindto: LoginDto){
            return this.authService.login(logindto);
        }

    /**
     * Retrieves all users from the database.
     * @returns All users in the database.
     */
    public getAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    /**
     * Updates a user in the database.
     * @param id The ID of the user to update.
     * @param updateData The new user data.
     */
    public async updateUser(id: number, updateData: UpdateUserDto) {
        const { password, username } = updateData;
        const user = await this.userRepository.findOneBy({ id });

        user!.username = username ?? user!.username;

        if(password){
            user!.password = await this.authService.hashPassword(password);
        }
        return await this.userRepository.save(user!);
    }

    public async deleteUser(id: number, payload: JwtPayload){
        const user = await this.getCurrentUser(id);
        if(user.id === payload.id || payload.userRole === UserRole.ADMIN){
            await this.userRepository.remove(user);
            return {
                "status": "success",
                "message": "user deleted successfully"
            };
        }

        throw new ForbiddenException('access denied, you are not allowed!');
        
    }

    public async updateUserProfileImage(id: number, imageName: string) {

        const user = await this.getCurrentUser(id);
        if(user.imageProfile != null) 
            await this.removeUserProfileImage(id);
        
        return this.userRepository.update(id, { imageProfile: imageName });

    }

    /**
     * removes the profile image of a user.
     * @param id 
     * @returns 
     */
    public async removeUserProfileImage(id: number) {
        const user = await this.getCurrentUser(id);
        
        if(!user.imageProfile)
            throw new BadRequestException('no profile image to delete');
        
        const imagePath = join(process.cwd(), `./images/users/${user.imageProfile}`);
        unlinkSync(imagePath);

        user.imageProfile = null;
        return this.userRepository.save(user);
    }




}