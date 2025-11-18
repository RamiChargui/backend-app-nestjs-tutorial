import { IsNumber, IsString, Max, Min, MinLength } from "class-validator";

export class CreateReviewDto {
    @IsNumber()
    @Max(5)
    @Min(1)
    rating: number;

    @IsString()
    @MinLength(2)
    comment: string;
}