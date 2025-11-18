import { IsNumber, Min, Max, IsString, MinLength, IsOptional } from "class-validator";

export class UpdateReviewDto {
    @IsNumber()
    @Max(5)
    @Min(1)
    @IsOptional()
    rating?: number;

    @IsString()
    @MinLength(2)
    @IsOptional()
    comment?: string;
}