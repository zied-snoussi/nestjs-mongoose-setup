import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        type: String,
        description: 'Name of the product',
        example: 'Product 1',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        type: String,
        description: 'Description of the product',
        example: 'This is a great product',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        type: String,
        description: 'Price of the product',
        example: '100',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    price: string;

    @ApiProperty({
        type: String,
        description: 'Category of the product',
        example: 'Electronics',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    category: string;
}

export class UpdateProductDto {
    @ApiProperty({
        type: String,
        description: 'Name of the product',
        example: 'Product 1',
        required: false,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        type: String,
        description: 'Description of the product',
        example: 'This is a great product',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        type: String,
        description: 'Price of the product',
        example: '100',
        required: false,
    })
    @IsOptional()
    @IsString()
    price?: string;

    @ApiProperty({
        type: String,
        description: 'Category of the product',
        example: 'Electronics',
        required: false,
    })
    @IsOptional()
    @IsString()
    category?: string;
}

export class ProductResponseDto {
    @ApiProperty({
        type: String,
        description: 'ID of the product',
        example: '60f6e3e3e3e3e3e3e3e3e3e3',
        required: true,
    })
    _id: string;
    
    @ApiProperty({
        type: String,
        description: 'Name of the product',
        example: 'Product 1',
        required: true,
    })
    name: string;

    @ApiProperty({
        type: String,
        description: 'Description of the product',
        example: 'This is a great product',
        required: true,
    })
    description: string;

    @ApiProperty({
        type: String,
        description: 'Price of the product',
        example: '100',
        required: true,
    })
    price: string;

    @ApiProperty({
        type: String,
        description: 'Category of the product',
        example: 'Electronics',
        required: true,
    })
    category: string;

    @ApiProperty({
        type: String,
        description: 'Created at',
        example: '2021-07-20T00:00:00.000Z',
        required: true,
    })
    created_at: Date;

    @ApiProperty({
        type: String,
        description: 'Updated at',
        example: '2021-07-20T00:00:00.000Z',
        required: true,
    })
    updated_at: Date;
}
