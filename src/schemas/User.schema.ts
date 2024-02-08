import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class User {
    @Prop({ required: true })
    first_name: string;
    @Prop({ required: true})
    last_name: string;
    @Prop({ required: true,unique: true })
    username: string;
    @Prop({ required: true })
    password: string;
    @Prop({ required: true,unique: true })
    email: string;
    @Prop({ required: true, enum: ['technician', 'admin', 'manager']})
    role: string;
    @Prop({ required: true })
    created_at: Date;
    @Prop({ required: true })
    updated_at: Date;
}
