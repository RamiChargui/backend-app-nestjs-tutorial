import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Max, Min, MinLength } from "class-validator";

export class CreateReviewDto {
    @IsNumber()
    @Max(5)
    @Min(1)
    @ApiProperty({description: "Rating of the review", minimum: 1, maximum: 5})
    rating: number;

    @IsString()
    @MinLength(2)
    @ApiProperty({description: "Comment of the review", minLength: 2})
    comment: string;
}