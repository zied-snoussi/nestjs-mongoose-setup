import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
    @Prop({ required: false })
    first_name?: string;
    @Prop({ required: false })
    last_name?: string;
    @Prop({ required: true, unique: true })
    username: string;
    @Prop({ required: true })
    password: string;
    @Prop({ required: true, unique: true })
    email: string;
    @Prop({ required: true, enum: ['admin', 'manager'] })
    role: string;
    @Prop({ required: true, default: Date.now })
    created_at: Date;
    @Prop({ required: true, default: Date.now })
    updated_at: Date;
}


export const UserSchema = SchemaFactory.createForClass(User);