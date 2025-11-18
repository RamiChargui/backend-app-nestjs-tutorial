import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto{

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    @IsOptional()
    password?: string;

    @IsString()
    @MaxLength(150)
    @IsOptional()
    username?: string;
}