import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Request, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto, UserListResponseDto, UserResponseDto } from "./dto/User.dto";
import { UserService } from "./user.service";
import mongoose from "mongoose";
import { LoginDto } from "./dto/Auth.dto";
import { RefreshJwtGuard } from "../guadrs/refresh.guard";
import { JwtGuard } from "../guadrs/jwt.guards";


@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe())
    createUser(@Body() createUserDto: CreateUserDto) {
        const newUser = this.userService.createUser(createUserDto);
        if (!newUser) throw new HttpException('User not created', 404);
        return newUser;
    }

    @UseGuards(JwtGuard)
    @Get()
    async getAllUsers(): Promise<UserListResponseDto> {
        const users = await this.userService.getAllUsers();
        if (!users) throw new HttpException('No users found', 404);
        return users;
    }

    @UseGuards(JwtGuard)
    @Get(':id')
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
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid user id', 400);
        const updatedUser = await this.userService.updateUser(id, updateUserDto);
        if (!updatedUser) throw new HttpException('No user found', 404);
        return updatedUser;
    }


    @Delete(':id')
    @UseGuards(JwtGuard)
    async deleteUser(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid user id', 400);
        const deletedUser = await this.userService.deleteUser(id);
        if (!deletedUser) throw new HttpException('No user found', 404);
        return "User deleted successfully";
    }

    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        return await this.userService.createUser(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return await this.userService.login(dto);
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    async refresh(@Request() req) {
        return await this.userService.refreshToken(req.user)
    }

}