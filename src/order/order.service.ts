import { Injectable } from "@nestjs/common"; // Import the Injectable decorator from the '@nestjs/common' library.
import { InjectModel } from "@nestjs/mongoose"; // Import the InjectModel decorator from the '@nestjs/mongoose' library.
import { Model } from "mongoose"; // Import the Model type from the 'mongoose' library.
import { Order } from "../schema/Order.schema"; // Import the Order schema from the '../schema/Order.schema' file.
import { CreateOrderDto, OrderResponseDto, UpdateOrderDto } from "./dto/Order.dto"; // Import DTOs related to order operations.

@Injectable() // Decorator to define the class as an injectable service.
export class OrderService {
    constructor(@InjectModel(Order.name) private orderModel: Model<Order>) { } // Inject the Order model into the service.

    createOrder(createOrderDto: CreateOrderDto) { // Method to create a new order.
        const newOrder = new this.orderModel(createOrderDto); // Create a new order instance with the provided DTO.
        return newOrder.save(); // Save the new order to the database.
    }

    async getAllOrders(): Promise<OrderResponseDto[]> { // Asynchronous method to retrieve all orders.
        return await this.orderModel.find(); // Find and return all orders from the database.
    }

    async getOrderById(id: string): Promise<OrderResponseDto> { // Asynchronous method to retrieve an order by ID.
        return await this.orderModel.findById(id); // Find and return the order with the provided ID from the database.
    }

    async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> { // Asynchronous method to update an order by ID.
        return await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }); // Find the order by ID, update it with the provided DTO, and return the updated order.
    }

    async deleteOrder(id: string) { // Asynchronous method to delete an order by ID.
        return await this.orderModel.findByIdAndDelete(id); // Find and delete the order with the provided ID from the database.
    }
}
