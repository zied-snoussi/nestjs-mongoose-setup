import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    price: string;

    @IsNotEmpty()
    @IsString()
    category: string;

    created_at: Date;

    updated_at: Date;

}

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    price?: string;

    @IsOptional()
    @IsString()
    category?: string;

    updated_at: Date;
}

export class ProductResponseDto {
    _id: string;
    name: string;
    description: string;
    price: string;
    category: string;
    created_at: Date;
    updated_at: Date;
}
