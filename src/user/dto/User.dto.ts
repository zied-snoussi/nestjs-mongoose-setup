import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        type: String,
        description: 'First name of the user',
        example: 'John',
        required: false,
    })
    @IsString()
    @IsOptional()
    first_name?: string;

    @ApiProperty({
        type: String,
        description: 'Last name of the user',
        example: 'Doe',
        required: false,
    })
    @IsOptional()
    @IsString()
    last_name?: string;

    @ApiProperty({
        type: String,
        description: 'Username of the user',
        example: 'johndoe',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        type: String,
        description: 'Password of the user',
        example: 'password123',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        type: String,
        description: 'Email of the user',
        example: 'jhondoe@example.com',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        type: String,
        description: 'Role of the user [admin, manager]',
        example: 'admin',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @IsEnum(['admin', 'manager'])
    role: string;
}

export class UpdateUserDto {
    @ApiProperty({
        type: String,
        description: 'First name of the user',
        example: 'John',
        required: false,
    })
    @IsOptional()
    @IsString()
    first_name?: string;

    @ApiProperty({
        type: String,
        description: 'Last name of the user',
        example: 'Doe',
        required: false,
    })
    @IsOptional()
    @IsString()
    last_name?: string;

    @ApiProperty({
        type: String,
        description: 'Password of the user',
        example: 'password123',
        required: false,
    })
    @IsOptional()
    @IsString()
    password?: string;
}

export class UserResponseDto {
    @ApiProperty({
        type: String,
        description: 'ID of the user',
        example: '60f6e3e3e3e3e3e3e3e3e3e3',
        required: true,
    })
    _id: string;
    
    @ApiProperty({
        type: String,
        description: 'First name of the user',
        example: 'John',
        required: false,
    })
    first_name: string;

    @ApiProperty({
        type: String,
        description: 'Last name of the user',
        example: 'Doe',
        required: false,
    })
    last_name: string;
    
    @ApiProperty({
        type: String,
        description: 'Username of the user',
        example: 'johndoe',
        required: true,
    })
    username: string;
    
    @ApiProperty({
        type: String,
        description: 'Email of the user',
        example: 'jhondoe@example.com',
        required: true,
    })
    email: string;

    @ApiProperty({
        type: String,
        description: 'Role of the user',
        example: 'admin',
        required: true,
    })
    role: string;
    
    @ApiProperty({
        type: Date,
        description: 'Date the user was created',
        example: '2021-07-21T00:00:00.000Z',
        required: true,
    })
    created_at: Date;
    @ApiProperty({
        type: Date,
        description: 'Date the user was last updated',
        example: '2021-07-21T00:00:00.000Z',
        required: true,
    })
    updated_at: Date;
}

export class UserListResponseDto {
    @ApiProperty({
        type: [UserResponseDto],
        description: 'List of users',
    })
    users: UserResponseDto[];
}
