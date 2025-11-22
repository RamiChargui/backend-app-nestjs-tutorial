import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, Min, Max, IsString, MinLength, IsOptional } from "class-validator";

export class UpdateReviewDto {
    @IsNumber()
    @Max(5)
    @Min(1)
    @IsOptional()
    @ApiPropertyOptional()
    rating?: number;

    @IsString()
    @MinLength(2)
    @IsOptional()
    @ApiPropertyOptional()
    comment?: string;
}