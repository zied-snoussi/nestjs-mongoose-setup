import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Rating {
    @Prop({ required: true })
    user_id: string;
    @Prop({ required: true })
    product_id: string;
    @Prop({ required: true })
    rating: number;
    @Prop({ required: false })
    comment: string;
    @Prop({ required: true, default: Date.now })
    created_at: Date;
    @Prop({ required: true, default: Date.now })
    updated_at: Date;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);