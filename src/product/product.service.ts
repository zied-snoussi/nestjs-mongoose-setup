import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose"; 
import { Model } from "mongoose";
import { Product } from "src/schema/Product.schema";
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from "./dto/Product.dto";

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

    createProduct(createProductDto: CreateProductDto) {
        const newProduct = new this.productModel(createProductDto);
        return newProduct.save();
    }

    async getAllProducts(): Promise<ProductResponseDto[]> {
        return await this.productModel.find();
    }

    async getProductById(id: string): Promise<ProductResponseDto> {
        return await this.productModel.findById(id);
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
        return await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
    }

    async deleteProduct(id: string) {
        return await this.productModel.findByIdAndDelete(id);
    }
}
