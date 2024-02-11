import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"; // Import required decorators and modules from the '@nestjs/common' library.
import { CreateProductDto, ProductResponseDto, UpdateProductDto } from "./dto/Product.dto"; // Import DTOs related to product operations.
import mongoose from "mongoose"; // Import mongoose for object ID validation.
import { ProductService } from "./product.service"; // Import ProductService for product-related operations.
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"; // Import Swagger decorators for API documentation.
import { JwtGuard } from "src/guards/jwt.guards"; // Import JwtGuard for JWT token authentication.

@ApiTags('products') // Decorator to group API under 'products' tag in Swagger UI.
@Controller('products') // Decorator to define the controller path.
export class ProductController {
    constructor(private productService: ProductService) { } // Inject ProductService into the controller.

    @Post() // Decorator to define a POST endpoint for creating a product.
    @UseGuards(JwtGuard) // Use JwtGuard for authentication.
    @UsePipes(new ValidationPipe()) // Use ValidationPipe for payload validation.
    @ApiCreatedResponse({ description: 'Product created successfully.', type: ProductResponseDto }) // Swagger documentation for successful creation response.
    @ApiBadRequestResponse({ description: 'Invalid data provided.' }) // Swagger documentation for bad request response.
    @ApiBearerAuth() // Indicate that JWT token is required for this endpoint in Swagger documentation.
    createProduct(@Body() createProductDto: CreateProductDto) { // Method to handle creation of a new product.
        return this.productService.createProduct(createProductDto); // Call ProductService to create the product.
    }

    @Get() // Decorator to define a GET endpoint for retrieving all products.
    @UseGuards(JwtGuard) // Use JwtGuard for authentication.
    @ApiOkResponse({ description: 'List of all products.', type: [ProductResponseDto] }) // Swagger documentation for successful retrieval response.
    async getAllProducts(): Promise<ProductResponseDto[]> { // Asynchronous method to handle retrieval of all products.
        const products = await this.productService.getAllProducts(); // Call ProductService to get all products.
        if (!products) throw new HttpException('No products found', 404); // Throw an exception if no products are found.
        return products; // Return the list of products.
    }

    @Get(':id') // Decorator to define a GET endpoint for retrieving a product by ID.
    @UseGuards(JwtGuard) // Use JwtGuard for authentication.
    @ApiOkResponse({ description: 'Product found successfully.', type: ProductResponseDto }) // Swagger documentation for successful retrieval response.
    @ApiNotFoundResponse({ description: 'Product not found.' }) // Swagger documentation for product not found response.
    async getProductById(@Param('id') id: string): Promise<ProductResponseDto> { // Asynchronous method to handle retrieval of a product by ID.
        const isValid = mongoose.Types.ObjectId.isValid(id); // Check if the provided ID is a valid MongoDB object ID.
        if (!isValid) throw new HttpException('Invalid product id', 400); // Throw an exception if the ID is invalid.
        const product = await this.productService.getProductById(id); // Call ProductService to get the product by ID.
        if (!product) throw new HttpException('No product found', 404); // Throw an exception if no product is found.
        return product; // Return the product.
    }

    @Patch(':id') // Decorator to define a PATCH endpoint for updating a product by ID.
    @UseGuards(JwtGuard) // Use JwtGuard for authentication.
    @UsePipes(new ValidationPipe()) // Use ValidationPipe for payload validation.
    @ApiOkResponse({ description: 'Product updated successfully.', type: ProductResponseDto }) // Swagger documentation for successful update response.
    @ApiNotFoundResponse({ description: 'Product not found.' }) // Swagger documentation for product not found response.
    async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductResponseDto> { // Asynchronous method to handle updating a product by ID.
        const isValid = mongoose.Types.ObjectId.isValid(id); // Check if the provided ID is a valid MongoDB object ID.
        if (!isValid) throw new HttpException('Invalid product id', 400); // Throw an exception if the ID is invalid.
        const product = await this.productService.updateProduct(id, updateProductDto); // Call ProductService to update the product.
        if (!product) throw new HttpException('No product found', 404); // Throw an exception if no product is found.
        return product; // Return the updated product.
    }

    @Delete(':id') // Decorator to define a DELETE endpoint for deleting a product by ID.
    @UseGuards(JwtGuard) // Use JwtGuard for authentication.
    @ApiOkResponse({ description: 'Product deleted successfully.' }) // Swagger documentation for successful deletion response.
    @ApiNotFoundResponse({ description: 'Product not found.' }) // Swagger documentation for product not found response.
    async deleteProduct(@Param('id') id: string) { // Asynchronous method to handle deletion of a product by ID.
        const isValid = mongoose.Types.ObjectId.isValid(id); // Check if the provided ID is a valid MongoDB object ID.
        if (!isValid) throw new HttpException('Invalid product id', 400); // Throw an exception if the ID is invalid.
        const deletedProduct = await this.productService.deleteProduct(id); // Call ProductService to delete the product by ID.
        if (!deletedProduct) throw new HttpException('No product found', 404); // Throw an exception if no product is found.
        return "Product deleted successfully"; // Return success message.
    }
}
