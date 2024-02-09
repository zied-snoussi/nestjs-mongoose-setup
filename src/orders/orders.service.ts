import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose"; 
import { Model } from "mongoose";
import { Order } from "src/schemas/Order.schema";
import { CreateOrderDto, OrderResponseDto, UpdateOrderDto } from "./dto/Order.dto";

@Injectable()
export class OrdersService {
    constructor(@InjectModel(Order.name) private orderModel: Model<Order>) { }

    createOrder(createOrderDto: CreateOrderDto) {
        const newOrder = new this.orderModel(createOrderDto);
        return newOrder.save();
    }

    async getAllOrders(): Promise<OrderResponseDto[]> {
        return await this.orderModel.find();
    }

    async getOrderById(id: string): Promise<OrderResponseDto> {
        return await this.orderModel.findById(id);
    }

    async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
        return await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true });
    }

    async deleteOrder(id: string) {
        return await this.orderModel.findByIdAndDelete(id);
    }
}
