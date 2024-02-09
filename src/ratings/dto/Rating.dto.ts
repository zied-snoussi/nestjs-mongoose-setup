import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRatingDto {
    @IsNotEmpty()
    @IsString()
    user_id: string;

    @IsNotEmpty()
    @IsString()
    product_id: string;

    @IsNotEmpty()
    @IsNumber()
    rating: number;

    @IsOptional()
    @IsString()
    comment?: string;

    created_at: Date;

    updated_at: Date;

}

export class UpdateRatingDto {
    @IsOptional()
    @IsString()
    user_id?: string;

    @IsOptional()
    @IsString()
    product_id?: string;

    @IsOptional()
    @IsNumber()
    rating?: string;

    @IsOptional()
    @IsString()
    comment?: string;

    updated_at: Date;
}

export class RatingResponseDto {
    _id: string;
    user_id: string;
    product_id: string;
    rating: number;
    comment: string;
    created_at: Date;
    updated_at: Date;
}

