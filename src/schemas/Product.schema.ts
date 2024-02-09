import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Product {
    @Prop({ required: true })
    name: string;
    @Prop({ required: false })
    description: string;
    @Prop({ required: true })
    price: number;
    @Prop({ required: true })
    category: string;
    @Prop({ required: true })
    created_at: Date;
    @Prop({ required: true })
    updated_at: Date;

}

export const ProductSchema = SchemaFactory.createForClass(Product);