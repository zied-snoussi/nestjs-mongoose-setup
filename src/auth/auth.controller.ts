import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UserResponseDto } from '../user/dto/User.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/Auth.dto';
import { RefreshJwtGuard } from '../guards/refresh.guard';

@ApiTags('auth') // Tag the controller with 'auth' for Swagger documentation.
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }


    @Post('register') // HTTP POST method to register a new user.
    @ApiCreatedResponse({ description: 'User registered successfully.', type: UserResponseDto }) // Swagger response documentation.
    async register(@Body() dto: CreateUserDto) {
        return await this.authService.register(dto);
    }

    @Post('login') // HTTP POST method to log in a user.
    @ApiOkResponse({ description: 'User logged in successfully.' }) // Swagger response documentation.
    async login(@Body() dto: LoginDto) {
        return await this.authService.login(dto);
    }

    @UseGuards(RefreshJwtGuard) // Apply RefreshJwtGuard to protect this endpoint.
    @Post('refresh') // HTTP POST method to refresh JWT tokens.
    @ApiOkResponse({ description: 'Token refreshed successfully.' }) // Swagger response documentation.
    async refresh(@Request() req) {
        return await this.authService.refreshToken(req.user);
    }
}
