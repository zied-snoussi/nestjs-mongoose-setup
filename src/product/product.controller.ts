import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateProductDto, ProductResponseDto, UpdateProductDto } from "./dto/Product.dto";
import mongoose from "mongoose";
import { ProductService } from "./product.service";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"; // Added Swagger decorators
import { JwtGuard } from "src/guards/jwt.guards";

@ApiTags('products') // Added to group API under 'products' tag in Swagger UI
@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Post()
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe())
    @ApiCreatedResponse({ description: 'Product created successfully.', type: ProductResponseDto })
    @ApiBadRequestResponse({ description: 'Invalid data provided.' })
    @ApiBearerAuth() // Added to specify that JWT token is required for this endpoint
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.productService.createProduct(createProductDto);
    }

    @Get()
    @UseGuards(JwtGuard)
    @ApiOkResponse({ description: 'List of all products.', type: [ProductResponseDto] })
    async getAllProducts(): Promise<ProductResponseDto[]> {
        const products = await this.productService.getAllProducts();
        if (!products) throw new HttpException('No products found', 404);
        return products;
    }

    @Get(':id')
    @UseGuards(JwtGuard)
    @ApiOkResponse({ description: 'Product found successfully.', type: ProductResponseDto })
    @ApiNotFoundResponse({ description: 'Product not found.' })
    async getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid product id', 400);
        const product = await this.productService.getProductById(id);
        if (!product) throw new HttpException('No product found', 404);
        return product;
    }

    @Patch(':id')
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe())
    @ApiOkResponse({ description: 'Product updated successfully.', type: ProductResponseDto })
    @ApiNotFoundResponse({ description: 'Product not found.' })
    async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid product id', 400);
        const product = await this.productService.updateProduct(id, updateProductDto);
        if (!product) throw new HttpException('No product found', 404);
        return product;
    }

    @Delete(':id')
    @UseGuards(JwtGuard)
    @ApiOkResponse({ description: 'Product deleted successfully.' })
    @ApiNotFoundResponse({ description: 'Product not found.' })
    async deleteProduct(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid product id', 400);
        const deletedProduct = await this.productService.deleteProduct(id);
        if (!deletedProduct) throw new HttpException('No product found', 404);
        return "Product deleted successfully";
    }
}
