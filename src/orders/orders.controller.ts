import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateOrderDto, OrderResponseDto, UpdateOrderDto } from "./dto/Order.dto";
import { OrdersService } from "./orders.service";
import mongoose from "mongoose";

@Controller('orders')
export class OrdersController {
    constructor(private orderService: OrdersService) { }
    @Post()
    @UsePipes(new ValidationPipe())
    createOrder(@Body() createOrderDto: CreateOrderDto) {
        return this.orderService.createOrder(createOrderDto);
    }

    @Get()
    async getAllOrders(): Promise<OrderResponseDto[]> {
        const orders = await this.orderService.getAllOrders();
        if (!orders) throw new HttpException('No orders found', 404);
        return orders;
    }

    @Get(':id')
    async getOrderById(@Param('id') id: string): Promise<OrderResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid order id', 400);
        const order = await this.orderService.getOrderById(id);
        if (!order) throw new HttpException('No order found', 404);
        return order;
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid order id', 400);
        const order = await this.orderService.updateOrder(id, updateOrderDto);
        if (!order) throw new HttpException('No order found', 404);
        return order;
    }
}
