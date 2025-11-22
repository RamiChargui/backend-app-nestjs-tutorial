
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @Length(2,150)
    @ApiProperty({description: "Title of the product", minLength: 2, maxLength: 150})
    title: string;

    @IsString()
    @ApiProperty({description: "Description of the product"})   
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0, {message: "price should not be less ten zero !"})
    @ApiProperty({description: "Price of the product", minimum: 0})
    price: number;
}