import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UseGuards, ValidationPipe } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { title } from "process";
import { ProductService } from "./product.service";
import { UpdateDescription } from "typeorm";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { AuthRoleGuard } from "src/users/guards/auth-role.guard";
import { Roles } from "src/users/decorators/user-role.decorator";
import { UserRole } from "src/utils/user_role";
import { ApiOperation, ApiQuery, ApiSecurity } from "@nestjs/swagger";



@Controller("api/products")
export class ProductsController{

    constructor(private readonly productSerice: ProductService){}

    @Post()
    @UseGuards(AuthRoleGuard)
    @Roles(UserRole.ADMIN)
    @ApiSecurity('bearer') 
    public createProduct(@Body(new ValidationPipe({whitelist: true})) body:CreateProductDto){
        return this.productSerice.create(body);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve a paginated list of products with optional filters' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    public getAllProducts(@Query() query: any, @Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit: number){
        
        return this.productSerice.getAll(query, page, limit);
    }

    @Get(":id")
    public getOneProduct(@Param("id", ParseIntPipe) id:number){

        return this.productSerice.getOne(id);
    }

    @Put(":id")
    @UseGuards(AuthRoleGuard)
    @Roles(UserRole.ADMIN)
    @ApiSecurity('bearer') 
    public updateProduct(@Param('id', ParseIntPipe) id: number, @Body() body:UpdateProductDto){
        return this.productSerice.updateProduct(id, body);
    }

    @Delete(":id")
    @UseGuards(AuthRoleGuard)
    @Roles(UserRole.ADMIN)
    @ApiSecurity('bearer') 
    public deleteProduct(@Param("id", ParseIntPipe) id: number){
        return this.productSerice.delete(id);
    }

}