import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Review } from "./review.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductService } from "src/products/product.service";
import { UserService } from "src/users/services/user.service";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { create } from "domain";
import { UpdateReviewDto } from "./dtos/update-review.dto";
import { JwtPayload } from "src/utils/types";
import { UserRole } from "src/utils/user_role";

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @Inject(forwardRef(() => ProductService))
        private readonly productService: ProductService,
        private readonly userService: UserService,
    ){}

    /**
     * CREATE REVIEW
     * @param productId 
     * @param userId 
     * @param dto 
     * @returns 
     */
    public async createReview(productId: number, userId: number, dto : CreateReviewDto){
        const product = await this.productService.getOne(productId);
        const user = await this.userService.getCurrentUser(userId);

        const review = this.reviewRepository.create({
            ...dto,
            product,
            user
        });

        const result= await this.reviewRepository.save(review);
        return {
            id: result.id,
            rating: result.rating,
            comment: result.comment,
            createdAt: result.createdAt,
            productId: product.id,
            userId: user.id
        }
    }

    /**
     * Get all reviews
     * @returns 
     */
    public async getAllReviews(){
        return this.reviewRepository.find({order: {createdAt: "DESC"}});
    }
 
    /**
     * Get one review
     * @param id 
     * @returns 
     */
    public async getOne( id:number){
            const review = await this.reviewRepository.findOne({where: {id}});
            if(!review) throw new NotFoundException("review not found");
            return review;
    }

    public async updateReview( id:number,userId: number, updateReviewDto: UpdateReviewDto){
            const review = await this.reviewRepository.findOne({where: {id}});
            if(!review) throw new NotFoundException("review not found");
            if(review.user.id !== userId) throw new ForbiddenException("You are not authorized to update this review");
                
            review.rating = updateReviewDto.rating ?? review?.rating;
            review.comment = updateReviewDto.comment ?? review?.comment;
            return this.reviewRepository.save(review);
    }
    
    public async delete(id: number, payload: JwtPayload){
        const review= await this.getOne(id);
        if(!review) throw new NotFoundException("review not found");
        if(review.user.id == payload.id || payload.userRole === UserRole.ADMIN){
            await this.reviewRepository.remove(review);
            return { message: 'review deleted successfully'}
        } 
        throw new ForbiddenException("You are not authorized to delete this review");
        
    }



}