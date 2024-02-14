import { HttpException, HttpStatus, Injectable } from "@nestjs/common"; // Import the Injectable decorator from the '@nestjs/common' library.
import { InjectModel } from "@nestjs/mongoose"; // Import the InjectModel decorator from the '@nestjs/mongoose' library.
import { Model } from "mongoose"; // Import the Model type from the 'mongoose' library.
import { Order } from "../schema/Order.schema"; // Import the Order schema from the '../schema/Order.schema' file.
import { CreateOrderDto, OrderResponseDto, UpdateOrderDto } from "./dto/Order.dto"; // Import DTOs related to order operations.

@Injectable() // Decorator to define the class as an injectable service.
export class OrderService {
    constructor(@InjectModel(Order.name) private orderModel: Model<Order>) { } // Inject the Order model into the service.

    createOrder(createOrderDto: CreateOrderDto) { // Method to create a new order.
        const newOrder = new this.orderModel(createOrderDto); // Create a new order instance with the provided data.
        return newOrder.save(); // Save the new order to the database and return the result.
    }

    async getAllOrders() { // Asynchronous method to retrieve all orders.
        const orders = await this.orderModel.find(); // Retrieve all orders from the database.
        if (!orders) {
            throw new HttpException('No orders found', HttpStatus.NOT_FOUND);
        }
        return orders;
    }

    async getOrderById(id: string){ // Asynchronous method to retrieve an order by ID.
        const order = await this.orderModel.findById(id); //
        if (!order) {
            throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
        }
        return order;
    }

    async updateOrder(id: string, updateOrderDto: UpdateOrderDto){ // Asynchronous method to update an order by ID.
        const updatedOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }); // Find, update, and return the order with the provided ID from the database.
        if (!updatedOrder) {
            throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
        }
        return updatedOrder;
    }

    async deleteOrder(id: string) { // Asynchronous method to delete an order by ID.
        const deletedOrder = await this.orderModel.findByIdAndDelete(id); // Find and delete the order with the provided ID from the database.
        if (!deletedOrder) {
            throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
        }
        return deletedOrder;
    }
}
