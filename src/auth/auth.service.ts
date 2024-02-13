import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/Auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/User.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }
    
    // Method to log in a user
    async login(dto: LoginDto) {
        const user = await this.validateUser(dto);
        const payload = {
            username: user.username,
            sub: user._id
        };

        // Generate access and refresh tokens
        return {
            user,
            backendTokens: {
                accessToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '1h',
                    secret: process.env.JWT_SECRET_KEY,
                }),
                refreshToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '7d',
                    secret: process.env.JWT_REFRESH_TOKEN,
                }),
            }
        };
    }

    // Method to validate user credentials
    async validateUser(dto: LoginDto) {
        const user = await this.userService.findUserByEmail(dto.email);
        if (user && (await bcrypt.compare(dto.password, user.password))) {
            // Omit the password from the result
            const { password, ...result }:any = user;
            return result;
        }
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Method to refresh tokens
    async refreshToken(user: any) {
        const payload = {
            username: user.username,
            sub: user.sub,
        };
        return {
            accessToken: await this.jwtService.signAsync(payload, {
                expiresIn: '1h',
                secret: process.env.JWT_SECRET_KEY,
            }),
            refreshToken: await this.jwtService.signAsync(payload, {
                expiresIn: '7d',
                secret: process.env.JWT_REFRESH_TOKEN,
            }),
        }
    }

    async register(dto: CreateUserDto) {
        return await this.userService.createUser(dto);
    }
}