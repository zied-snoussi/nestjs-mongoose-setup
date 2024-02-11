import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
    @ApiProperty({
        type: String,
        description: 'User id',
        example: '5f4e7f3b3f5d8d1f3f3f3f3f',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    user_id: string;
    
    @ApiProperty({
        type: String,
        description: 'Product id',
        example: '5f4e7f3b3f5d8d1f3f3f3f3f',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    product_id: string;

    @ApiProperty({
        type: String,
        description: 'Quantity',
        example: '5',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    quantity: string;

    @ApiProperty({
        type: String,
        description: 'Status',
        example: 'Pending',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    status: string;
}

export class UpdateOrderDto {
    @ApiProperty({
        type: String,
        description: 'User id',
        example: '5f4e7f3b3f5d8d1f3f3f3f3f',
        required: false,
    })
    @IsOptional()
    @IsString()
    user_id?: string;

    @ApiProperty({
        type: String,
        description: 'Product id',
        example: '5f4e7f3b3f5d8d1f3f3f3f3f',
        required: false,
    })
    @IsOptional()
    @IsString()
    product_id?: string;

    @ApiProperty({
        type: String,
        description: 'Quantity',
        example: '5',
        required: false,
    })
    @IsOptional()
    @IsString()
    quantity?: string;

    @ApiProperty({
        type: String,
        description: 'Status',
        example: 'Pending',
        required: false,
    })
    @IsOptional()
    @IsString()
    status?: string;
}

export class OrderResponseDto {
    @ApiProperty({
        type: String,
        description: 'ID of the order',
        example: '60f6e3e3e3e3e3e3e3e3e3e3',
        required: true,
    })
    _id: string;

    @ApiProperty({
        type: String,
        description: 'User id',
        example: '5f4e7f3b3f5d8d1f3f3f3f3f',
        required: true,
    })
    user_id: string;
    
    @ApiProperty({
        type: String,
        description: 'Product id',
        example: '5f4e7f3b3f5d8d1f3f3f3f3f',
        required: true,
    })
    product_id: string;
    
    @ApiProperty({
        type: String,
        description: 'Quantity',
        example: '5',
        required: true,
    })
    quantity: string;

    @ApiProperty({
        type: String,
        description: 'Status',
        example: 'Pending',
        required: true,
    })
    status: string;

    @ApiProperty({
        type: Date,
        description: 'Created at',
        example: '2021-07-20T00:00:00.000Z',
        required: true,
    })
    created_at: Date;

    @ApiProperty({
        type: Date,
        description: 'Updated at',
        example: '2021-07-20T00:00:00.000Z',
        required: true,
    })
    updated_at: Date;
}
