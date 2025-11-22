
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateProductDto {
    @IsString()
    @Length(2,150)//or minLength(2) and maxLength(150)
    @IsOptional()
    @ApiPropertyOptional()
    title?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    @Min(0, {message: "price should not be less ten zero !"})
    @ApiPropertyOptional()
    price?: number;
}