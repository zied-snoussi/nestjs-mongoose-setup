import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Order {
    @Prop({ required: true })
    user_id: string;
    @Prop({ required: true })
    product_id: string;
    @Prop({ required: true })
    quantity: string;
    @Prop({ required: true })
    status: string;
    @Prop({ required: true })
    created_at: Date;
    @Prop({ required: true })
    updated_at: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);