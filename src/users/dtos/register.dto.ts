import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto{

    @IsString()
    @MaxLength(250)
    @IsNotEmpty()
    @ApiProperty({description: "Email of the user", maxLength: 250})
    email: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    @ApiProperty({description: "Password of the user", minLength: 6})
    password: string;

    @IsString()
    @MaxLength(150)
    @IsOptional()
    @ApiProperty({description: "Username of the user", maxLength: 150, required: false})
    username: string;
}