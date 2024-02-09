import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    user_id: string;

    @IsNotEmpty()
    @IsString()
    product_id: string;

    @IsNotEmpty()
    @IsString()
    quantity: string;

    @IsNotEmpty()
    @IsString()
    status: string;

    created_at: Date;

    updated_at: Date;

}

export class UpdateOrderDto {
    @IsOptional()
    @IsString()
    user_id?: string;

    @IsOptional()
    @IsString()
    product_id?: string;

    @IsOptional()
    @IsString()
    quantity?: string;

    @IsOptional()
    @IsString()
    status?: string;

    updated_at: Date;
}

export class OrderResponseDto {
    _id: string;
    user_id: string;
    product_id: string;
    quantity: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}
