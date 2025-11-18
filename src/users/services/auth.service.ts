import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterDto } from "../dtos/register.dto";
import * as bcrypt from 'bcryptjs';
import { LoginDto } from "../dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { AccessToken, JwtPayload } from "src/utils/types";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly JwtService: JwtService,
    ){}

    public getAllUsers(){
        return this.userRepository.find();
    }

    /**
     * Registers a new user.
     * @param RegisterDto The user registration data.
     * @returns JWT (access token).
     */
    public async register(userdto: RegisterDto): Promise<AccessToken> {
        const {email, password, username} = userdto;
        const userformdb = await this.userRepository.findOneBy( {email});
        if(userformdb) throw new BadRequestException('user already exists');

        
        const hashedPassword = await this.hashPassword(password);

        let newuser = this.userRepository.create({ email, username, password: hashedPassword });
        newuser = await this.userRepository.save(newuser);
        //to-do generate jwt token
        const accessToken = await this.generateJwtToken({ id: newuser.id, userRole: newuser.role });
        return {  accessToken };
    }

    public async login(logindto: LoginDto): Promise<AccessToken>{
        const { email, password } = logindto;
        const user = await this.userRepository.findOneBy({ email });
        if (!user) throw new BadRequestException('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new BadRequestException('Invalid credentials');

        // to-do generate jwt token
        const accessToken = await this.generateJwtToken({ id: user.id, userRole: user.role });
        return { accessToken };
    }

    /**
     * Hashes a plain text password.
     * @param password The plain text password to hash.
     * @returns The hashed password.
    */
    public async hashPassword(password: string){
        const salt = await bcrypt.genSalt(10);
           return bcrypt.hash(password, salt);
    }
    
    private async generateJwtToken(payload: JwtPayload){
        return this.JwtService.signAsync(payload);
    }

}