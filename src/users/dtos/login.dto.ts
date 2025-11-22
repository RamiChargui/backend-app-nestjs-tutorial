import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto{

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
}