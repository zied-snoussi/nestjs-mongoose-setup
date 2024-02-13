import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"; // Import necessary decorators and modules from '@nestjs/common'.
import { CreateOrderDto, OrderResponseDto, UpdateOrderDto } from "./dto/Order.dto"; // Import DTOs from the './dto/Order.dto' file.
import { OrderService } from "./order.service"; // Import the OrderService from the './order.service' file.
import mongoose from "mongoose"; // Import mongoose for ObjectId validation.
import { JwtGuard } from "../guards/jwt.guards"; // Import the JwtGuard from the '../guards/jwt.guards' file.
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"; // Import Swagger decorators.
import { RolesGuard } from "../guards/roles.guards";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "../enums/role.enum";

@ApiTags('orders') // Decorator to group API under 'orders' tag in Swagger UI.
@Controller('orders') // Decorator to define the controller with '/orders' route.
export class OrderController {
    constructor(private orderService: OrderService) { } // Constructor with OrderService injection.

    @Post() // Decorator to define a POST endpoint for creating an order.
    @UseGuards(JwtGuard, RolesGuard) // Apply JwtGuard and RolesGuard to protect this endpoint.
    @Roles([Role.Admin]) // Apply the 'admin' role to this endpoint.
    @UsePipes(new ValidationPipe()) // Use validation pipe for input validation.
    @ApiCreatedResponse({ description: 'Order created successfully.', type: OrderResponseDto }) // Swagger response documentation.
    @ApiBadRequestResponse({ description: 'Invalid data provided.' }) // Swagger response documentation.
    @ApiBearerAuth() // Swagger authorization documentation.
    createOrder(@Body() createOrderDto: CreateOrderDto) { // Handler for creating an order.
        return this.orderService.createOrder(createOrderDto); // Call the service to create the order.
    }

    @Get() // Decorator to define a GET endpoint for retrieving all orders.
    @UseGuards(JwtGuard, RolesGuard) // Apply JwtGuard and RolesGuard to protect this endpoint.
    @Roles([Role.Admin,Role.Manager]) // Apply the 'admin' role to this endpoint.
    @ApiOkResponse({ description: 'List of all orders.', type: [OrderResponseDto] }) // Swagger response documentation.
    async getAllOrders(): Promise<OrderResponseDto[]> { // Async handler for retrieving all orders.
        const orders = await this.orderService.getAllOrders(); // Call the service to retrieve all orders.
        if (!orders) throw new HttpException('No orders found', 404); // Throw an error if no orders are found.
        return orders; // Return the retrieved orders.
    }

    @Get(':id') // Decorator to define a GET endpoint for retrieving an order by ID.
    @UseGuards(JwtGuard, RolesGuard) // Apply JwtGuard and RolesGuard to protect this endpoint.
    @Roles([Role.Admin,Role.Manager]) // Apply the 'admin' role to this endpoint.
    @ApiOkResponse({ description: 'Order found successfully.', type: OrderResponseDto }) // Swagger response documentation.
    @ApiNotFoundResponse({ description: 'Order not found.' }) // Swagger response documentation.
    async getOrder(@Param('id') id: string): Promise<OrderResponseDto> { // Async handler for retrieving an order by ID.
        const isValid = mongoose.Types.ObjectId.isValid(id); // Check if the provided ID is a valid ObjectId.
        if (!isValid) throw new HttpException('Invalid order id', 400); // Throw an error if the ID is invalid.
        const order = await this.orderService.getOrderById(id); // Call the service to retrieve the order by ID.
        if (!order) throw new HttpException('No order found', 404); // Throw an error if no order is found.
        return order; // Return the retrieved order.
    }

    @Patch(':id') // Decorator to define a PATCH endpoint for updating an order by ID.
    @UseGuards(JwtGuard, RolesGuard) // Apply JwtGuard and RolesGuard to protect this endpoint.
    @Roles([Role.Admin]) // Apply the 'admin' role to this endpoint.
    @UsePipes(new ValidationPipe()) // Use validation pipe for input validation.
    @ApiOkResponse({ description: 'Order updated successfully.', type: OrderResponseDto }) // Swagger response documentation.
    @ApiNotFoundResponse({ description: 'Order not found.' }) // Swagger response documentation.
    async updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> { // Async handler for updating an order by ID.
        const isValid = mongoose.Types.ObjectId.isValid(id); // Check if the provided ID is a valid ObjectId.
        if (!isValid) throw new HttpException('Invalid order id', 400); // Throw an error if the ID is invalid.
        const order = await this.orderService.updateOrder(id, updateOrderDto); // Call the service to update the order by ID.
        if (!order) throw new HttpException('No order found', 404); // Throw an error if no order is found.
        return order; // Return the updated order.
    }

    @Delete(':id') // Decorator to define a DELETE endpoint for deleting an order by ID.
    @UseGuards(JwtGuard, RolesGuard) // Apply JwtGuard and RolesGuard to protect this endpoint.
    @Roles([Role.Admin]) // Apply the 'admin' role to this endpoint.
    @ApiOkResponse({ description: 'Order deleted successfully.' }) // Swagger response documentation.
    @ApiNotFoundResponse({ description: 'Order not found.' }) // Swagger response documentation.
    async deleteOrder(@Param('id') id: string) { // Async handler for deleting an order by ID.
        const isValid = mongoose.Types.ObjectId.isValid(id); // Check if the provided ID is a valid ObjectId.
        if (!isValid) throw new HttpException('Invalid order id', 400); // Throw an error if the ID is invalid.
        const order = await this.orderService.deleteOrder(id); // Call the service to delete the order by ID.
        if (!order) throw new HttpException('No order found', 404); // Throw an error if no order is found.
        return order; // Return a success message after deleting the order.
    }
}
