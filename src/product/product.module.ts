import { Module } from "@nestjs/common"; // Import the Module decorator from the @nestjs/common library.
import { MongooseModule } from "@nestjs/mongoose"; // Import the MongooseModule from the @nestjs/mongoose library.
import { Product, ProductSchema } from "../schema/Product.schema"; // Import the Product schema and ProductSchema from the schema folder.
import { ProductController } from "./product.controller"; // Import the ProductController from the product.controller file.
import { ProductService } from "./product.service"; // Import the ProductService from the product.service file.

@Module({ // Decorate the class as a module.
    imports: [ // Define the module imports.
        MongooseModule.forFeature([{ // Import the MongooseModule with the specified features.
            name: Product.name, // Specify the name of the model.
            schema: ProductSchema, // Specify the schema of the model.
        }])
    ],
    controllers: [ProductController], // Define the controllers associated with the module.
    providers: [ // Define the providers (services) associated with the module.
        ProductService, // Provide the ProductService as a provider.
    ]
})
export class ProductModule { } // Export the ProductModule class as a module.
