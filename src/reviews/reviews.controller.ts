import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { AuthRoleGuard } from "src/users/guards/auth-role.guard";
import { Roles } from "src/users/decorators/user-role.decorator";
import { User } from "src/users/user.entity";
import { UserRole } from "src/utils/user_role";
import { JwtPayload } from "src/utils/types";
import { currentUser } from "src/users/decorators/current-user.decorator";
import { UpdateReviewDto } from "./dtos/update-review.dto";


@Controller("api/reviews")
export class ReviewsController {

    constructor(
        private readonly reviewService: ReviewService
    ){}

    @Post(':productId')
    @UseGuards(AuthRoleGuard)
    @Roles(UserRole.USER, UserRole.ADMIN)
    public createReview(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() dto: CreateReviewDto,
        @Req() req: any
    ){
        return this.reviewService.createReview(productId, req.user.id, dto);
    }


    @Get()
    @UseGuards(AuthRoleGuard)
    @Roles(UserRole.ADMIN)
    public getAllReviews(){
        return this.reviewService.getAllReviews();
    }

    @Get(":id")
    public getOneReview(@Param("id", ParseIntPipe) id:number){
            return this.reviewService.getOne(id);
    }
    
        @Put(":id")
        @UseGuards(AuthRoleGuard)
        @Roles(UserRole.ADMIN)
        public updateReview(@Param('id', ParseIntPipe) id: number,@Req() req: any, @Body() body:UpdateReviewDto){
            return this.reviewService.updateReview(id, req.user.id, body);
        }
    
        @Delete(":id")
        @UseGuards(AuthRoleGuard)
        @Roles(UserRole.ADMIN)
        public deleteReview(@Param("id", ParseIntPipe) id: number, @Req() req: any){
            return this.reviewService.delete(id, req.user);
        }
}