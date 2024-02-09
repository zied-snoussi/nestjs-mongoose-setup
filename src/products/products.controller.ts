import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateProductDto, ProductResponseDto, UpdateProductDto } from "./dto/Product.dto";
import mongoose from "mongoose";
import { ProductsService } from "./products.service";
@Controller('products')
export class ProductsController {
    constructor(private productService: ProductsService) { }
    @Post()
    @UsePipes(new ValidationPipe())
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.productService.createProduct(createProductDto);
    }

    @Get()
    async getAllProducts(): Promise<ProductResponseDto[]> {
        const products = await this.productService.getAllProducts();
        if (!products) throw new HttpException('No products found', 404);
        return products;
    }

    @Get(':id')
    async getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid product id', 400);
        const product = await this.productService.getProductById(id);
        if (!product) throw new HttpException('No product found', 404);
        return product;
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid product id', 400);
        const product = await this.productService.updateProduct(id, updateProductDto);
        if (!product) throw new HttpException('No product found', 404);
        return product;
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid product id', 400);
        const deletedProduct = await this.productService.deleteProduct(id);
        if (!deletedProduct) throw new HttpException('No product found', 404);
        return "Product deleted successfully";
    }

}
