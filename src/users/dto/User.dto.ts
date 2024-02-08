import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsOptional()
    first_name?: string;

    @IsOptional()
    @IsString()
    last_name?: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(['admin', 'manager'])
    role: string;

    created_at: Date;

    updated_at: Date;

}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    first_name?: string;

    @IsOptional()
    @IsString()
    last_name?: string;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    @IsEnum(['admin', 'manager'])
    role?: string;

    updated_at: Date;
}

export class UserResponseDto {
    _id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    role: string;
    created_at: Date;
    updated_at: Date;
}

export class UserListResponseDto {
    users: UserResponseDto[];
}

