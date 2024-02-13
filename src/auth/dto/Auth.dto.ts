import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({
        type: String,
        description: 'Email of the user',
        example: 'jhondoe@example.com',
        required: true,
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        type: String,
        description: 'Password of the user',
        example: 'password123',
        required: true,
    })
    @IsString()
    password: string;
}