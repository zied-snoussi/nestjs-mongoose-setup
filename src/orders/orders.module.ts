import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "src/schemas/Order.schema";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
    imports: [MongooseModule.forFeature([{
        name: Order.name,
        schema: OrderSchema,
    }])
    ],
    controllers: [OrdersController],
    providers: [
        OrdersService,
    ]
})

export class OrdersModule { }
