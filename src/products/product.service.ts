import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { Between, Like, Repository } from "typeorm";
import { Product } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { ReviewService } from "src/reviews/review.service";
import { title } from "process";


@Injectable()
export class ProductService {
    constructor(
        @Inject(forwardRef(() => ReviewService)) 
        private readonly reviewService: ReviewService,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ){}

   
    
    /**
     * Creates a new product.
     * @param dto - The data transfer object containing product details.
     * @returns The created product.
     */   
    public async create( dto:CreateProductDto){
        const product = this.productRepository.create(
            {
                ...dto,
                title: dto.title.toLowerCase(),
            }
        );
        return await this.productRepository.save(product);
    
    }
        
    public getAll(query: any, numberPage: number, productPerPage: number){
        const filtres = {
            ...query['title'] ? { title: Like(`%${query['title']}%`) } : {},
            ...query['minPrice'] && query['maxPrice'] ? { price: Between(query['minPrice'], query['maxPrice']) } : {},
        }

        return this.productRepository.find({
            skip: (numberPage - 1) * productPerPage,
            take: productPerPage,
            where: filtres,
            // relations: { reviews: true }
        });
    }
    
    public async getOne( id:number){
        const product = await this.productRepository.findOne({where: {id}});
        if(!product) throw new NotFoundException("product not found");
        return product;
    }

    public async updateProduct( id:number, updateProductDto: UpdateProductDto){
        const product = await this.getOne(id);
        if(!product) throw new NotFoundException("product not found");
        product.title = updateProductDto.title ?? product?.title;
        product.description = updateProductDto.description ?? product?.description;
        product.price = updateProductDto.price ?? product?.price;
        return this.productRepository.save(product);
    }

    public async delete(id: number){
        const product= await this.getOne(id);
        if(!product) throw new NotFoundException("product not found");
        await this.productRepository.remove(product);
        return { message: 'product deleted successfully'}
    }

}