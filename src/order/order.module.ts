import { Module } from "@nestjs/common"; // Import the Module decorator from the '@nestjs/common' library.
import { MongooseModule } from "@nestjs/mongoose"; // Import the MongooseModule from the '@nestjs/mongoose' library.
import { OrderController } from "./order.controller"; // Import the OrderController from the './order.controller' file.
import { OrderService } from "./order.service"; // Import the OrderService from the './order.service' file.
import { Order, OrderSchema } from "../schema/Order.schema"; // Import the Order schema and OrderSchema from the '../schema/Order.schema' file.

@Module({ // Decorator to define the class as a module.
    imports: [MongooseModule.forFeature([{ // Import the MongooseModule with the Order schema.
        name: Order.name,
        schema: OrderSchema,
    }])],
    controllers: [OrderController], // Define the controllers associated with the module.
    providers: [
        OrderService, // Define the providers associated with the module.
    ]
})

export class OrderModule { } // Export the OrderModule class.
