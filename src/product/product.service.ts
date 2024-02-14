import { HttpException, Injectable } from "@nestjs/common"; // Import the Injectable decorator from the @nestjs/common library.
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

    async getAllProducts() { // Method to retrieve all products.
        const products = await this.productModel.find(); // Retrieve all products from the database.
        if (!products) throw new HttpException('No products found', 404); // Throw an exception if no products are found.
        return products; // Return the list of products.
    }

    async getProductById(id: string){ // Method to retrieve a product by ID.
        const product = await this.productModel.findById(id); // Retrieve a product by its ID from the database.
        if (!product) throw new HttpException('No product found', 404); // Throw an exception if no product is found.
        return product; // Return the retrieved product.
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto){ // Method to update a product.
        const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }); // Find, update, and return the product with the provided ID from the database.
        if (!updatedProduct) throw new HttpException('No product found', 404); // Throw an exception if no product is found.
        return updatedProduct; // Return the updated product.
    }

    async deleteProduct(id: string) { // Method to delete a product by ID.
        const deletedProduct = await this.productModel.findByIdAndDelete(id); // Find and delete the product with the provided ID from the database.
        if (!deletedProduct) throw new HttpException('No product found', 404); // Throw an exception if no product is found.
        return deletedProduct; // Return the deleted product.
    }
}
