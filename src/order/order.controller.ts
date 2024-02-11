import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateOrderDto, OrderResponseDto, UpdateOrderDto } from "./dto/Order.dto";
import { OrderService } from "./order.service";
import mongoose from "mongoose";
import { JwtGuard } from "../guards/jwt.guards";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('orders') // Added to group API under 'orders' tag in Swagger UI
@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Post()
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe())
    @ApiCreatedResponse({ description: 'Order created successfully.', type: OrderResponseDto })
    @ApiBadRequestResponse({ description: 'Invalid data provided.' })
    @ApiBearerAuth() // Added to specify that JWT token is required for this endpoint
    createOrder(@Body() createOrderDto: CreateOrderDto) {
        return this.orderService.createOrder(createOrderDto);
    }

    @Get()
    @UseGuards(JwtGuard)
    @ApiOkResponse({ description: 'List of all orders.', type: [OrderResponseDto] })
    async getAllOrders(): Promise<OrderResponseDto[]> {
        const orders = await this.orderService.getAllOrders();
        if (!orders) throw new HttpException('No orders found', 404);
        return orders;
    }

    @Get(':id')
    @UseGuards(JwtGuard)
    @ApiOkResponse({ description: 'Order found successfully.', type: OrderResponseDto })
    @ApiNotFoundResponse({ description: 'Order not found.' })
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
    @ApiOkResponse({ description: 'Order updated successfully.', type: OrderResponseDto })
    @ApiNotFoundResponse({ description: 'Order not found.' })
    async updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid order id', 400);
        const order = await this.orderService.updateOrder(id, updateOrderDto);
        if (!order) throw new HttpException('No order found', 404);
        return order;
    }

    @Delete(':id')
    @UseGuards(JwtGuard)
    @ApiOkResponse({ description: 'Order deleted successfully.' })
    @ApiNotFoundResponse({ description: 'Order not found.' })
    async deleteOrder(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid order id', 400);
        const order = await this.orderService.deleteOrder(id);
        if (!order) throw new HttpException('No order found', 404);
        return order;
    }
}
