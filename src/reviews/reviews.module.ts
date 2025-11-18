import { forwardRef, Module } from "@nestjs/common";
import { ReviewsController } from "./reviews.controller";
import { Type } from "class-transformer";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { ReviewService } from "./review.service";
import { ProductsModule } from "src/products/products.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    controllers: [ReviewsController],
    providers: [ReviewService],
    exports: [ReviewService],
    imports: [TypeOrmModule.forFeature([Review]), forwardRef(() => ProductsModule), UsersModule, JwtModule],
})
export class ReviewsModule{

}