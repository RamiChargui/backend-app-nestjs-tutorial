import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto{

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    password?: string;

    @IsString()
    @MaxLength(150)
    @IsOptional()
    @ApiPropertyOptional()
    username?: string;
}