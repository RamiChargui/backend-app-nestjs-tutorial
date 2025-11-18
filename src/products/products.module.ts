import { forwardRef, Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductService } from "./product.service";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Product } from "./product.entity";
import { ReviewsModule } from "src/reviews/reviews.module";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "src/users/services/user.service";
import { UsersModule } from "src/users/users.module";

@Module({
    controllers:[ProductsController],
    providers: [ProductService],
    exports: [ProductService],
    imports : [forwardRef(() => ReviewsModule),TypeOrmModule.forFeature([Product]), UsersModule,JwtModule],
})
export class ProductsModule{

}