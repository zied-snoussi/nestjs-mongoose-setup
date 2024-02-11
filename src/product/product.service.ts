import { Injectable } from "@nestjs/common"; // Import the Injectable decorator from the @nestjs/common library.
import { InjectModel } from "@nestjs/mongoose"; // Import the InjectModel decorator from the @nestjs/mongoose library.
import { Model } from "mongoose"; // Import the Model type from the mongoose library.
import { Product } from "../schema/Product.schema"; // Import the Product schema from the schema folder.
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from "./dto/Product.dto"; // Import DTOs for creating, updating, and retrieving products.

@Injectable() // Decorate the class as an injectable provider.
export class ProductService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) { } // Inject the Product model into the service.

    createProduct(createProductDto: CreateProductDto) { // Method to create a new product.
        const newProduct = new this.productModel(createProductDto); // Create a new product instance with the provided data.
        return newProduct.save(); // Save the new product to the database and return the result.
    }

    async getAllProducts(): Promise<ProductResponseDto[]> { // Method to retrieve all products.
        return await this.productModel.find(); // Find all products in the database and return them.
    }

    async getProductById(id: string): Promise<ProductResponseDto> { // Method to retrieve a product by ID.
        return await this.productModel.findById(id); // Find a product by its ID in the database and return it.
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> { // Method to update a product.
        return await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }); // Find a product by ID, update it with the provided data, and return the updated product.
    }

    async deleteProduct(id: string) { // Method to delete a product by ID.
        return await this.productModel.findByIdAndDelete(id); // Find a product by its ID, delete it from the database, and return the result.
    }
}
