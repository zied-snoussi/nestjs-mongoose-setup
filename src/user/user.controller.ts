import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Request, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto, UserListResponseDto, UserResponseDto } from "./dto/User.dto";
import { UserService } from "./user.service";
import mongoose from "mongoose";
import { LoginDto } from "./dto/Auth.dto";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"; // Added Swagger decorators
import { JwtGuard } from "src/guards/jwt.guards";
import { RefreshJwtGuard } from "src/guards/refresh.guard";

@ApiTags('users') // Added to group API under 'users' tag in Swagger UI
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe())
    @ApiCreatedResponse({
        description: 'User created successfully.',
        type: UserResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid data provided.' })
    @ApiBearerAuth() // Added to specify that JWT token is required for this endpoint
    createUser(@Body() createUserDto: CreateUserDto) {
        const newUser = this.userService.createUser(createUserDto);
        if (!newUser) throw new HttpException('User not created', 404);
        return newUser;
    }

    @UseGuards(JwtGuard)
    @Get()
    @ApiOkResponse({ description: 'List of all users.', type: UserListResponseDto })
    async getAllUsers(): Promise<UserListResponseDto> {
        const users = await this.userService.getAllUsers();
        if (!users) throw new HttpException('No users found', 404);
        return users;
    }

    @UseGuards(JwtGuard)
    @Get(':id')
    @ApiOkResponse({ description: 'User found successfully.', type: UserResponseDto })
    @ApiNotFoundResponse({ description: 'User not found.' })
    async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid user id', 400);
        const findUser = await this.userService.getUserById(id);
        if (!findUser) throw new HttpException('No user found', 404);
        return findUser;
    }

    @Patch(':id')
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe())
    @ApiOkResponse({ description: 'User updated successfully.', type: UserResponseDto })
    @ApiNotFoundResponse({ description: 'User not found.' })
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid user id', 400);
        const updatedUser = await this.userService.updateUser(id, updateUserDto);
        if (!updatedUser) throw new HttpException('No user found', 404);
        return updatedUser;
    }

    @Delete(':id')
    @UseGuards(JwtGuard)
    @ApiOkResponse({ description: 'User deleted successfully.' })
    @ApiNotFoundResponse({ description: 'User not found.' })
    async deleteUser(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid user id', 400);
        const deletedUser = await this.userService.deleteUser(id);
        if (!deletedUser) throw new HttpException('No user found', 404);
        return "User deleted successfully";
    }

    @Post('register')
    @ApiCreatedResponse({ description: 'User registered successfully.', type: UserResponseDto })
    async register(@Body() dto: CreateUserDto) {
        return await this.userService.createUser(dto);
    }

    @Post('login')
    @ApiOkResponse({ description: 'User logged in successfully.' })
    async login(@Body() dto: LoginDto) {
        return await this.userService.login(dto);
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    @ApiOkResponse({ description: 'Token refreshed successfully.' })
    async refresh(@Request() req) {
        return await this.userService.refreshToken(req.user)
    }
}
