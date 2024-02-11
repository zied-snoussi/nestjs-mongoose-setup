import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRatingDto {
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
        type: Number,
        description: 'Rating',
        example: 5,
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    rating: number;

    @ApiProperty({
        type: String,
        description: 'Comment',
        example: 'This is a great product',
        required: false,
    })
    @IsOptional()
    @IsString()
    comment?: string;
}

export class UpdateRatingDto {
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
        type: Number,
        description: 'Rating',
        example: 5,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    rating?: number;

    @ApiProperty({
        type: String,
        description: 'Comment',
        example: 'This is a great product',
        required: false,
    })
    @IsOptional()
    @IsString()
    comment?: string;
}

export class RatingResponseDto {
    @ApiProperty({
        type: String,
        description: 'ID of the rating',
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
        type: Number,
        description: 'Rating',
        example: 5,
        required: true,
    })
    rating: number;
    @ApiProperty({
        type: String,
        description: 'Comment',
        example: 'This is a great product',
        required: false,
    })
    comment: string;
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
