import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateOrderDto, OrderResponseDto, UpdateOrderDto } from "./dto/Order.dto";
import { OrderService } from "./order.service";
import mongoose from "mongoose";
import { JwtGuard } from "src/guadrs/jwt.guards";

@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService) { }
    @Post()
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe())
    createOrder(@Body() createOrderDto: CreateOrderDto) {
        return this.orderService.createOrder(createOrderDto);
    }

    @Get()
    @UseGuards(JwtGuard)
    async getAllOrders(): Promise<OrderResponseDto[]> {
        const orders = await this.orderService.getAllOrders();
        if (!orders) throw new HttpException('No orders found', 404);
        return orders;
    }

    @Get(':id')
    @UseGuards(JwtGuard)
    async getOrderById(@Param('id') id: string): Promise<OrderResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid order id', 400);
        const order = await this.orderService.getOrderById(id);
        if (!order) throw new HttpException('No order found', 404);
        return order;
    }

    @Patch(':id')
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe())
    async updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid order id', 400);
        const order = await this.orderService.updateOrder(id, updateOrderDto);
        if (!order) throw new HttpException('No order found', 404);
        return order;
    }
}
