import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto, UserListResponseDto, UserResponseDto } from "./dto/User.dto";
import { UsersService } from "./users.service";
import mongoose from "mongoose";

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }
    @Post()
    @UsePipes(new ValidationPipe())
    createUser(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto);
        return this.userService.createUser(createUserDto);
    }

    @Get()
    async getAllUsers(): Promise<UserListResponseDto> {
        const users = await this.userService.getAllUsers();
        if (!users) throw new HttpException('No users found', 404);
        return users;
    }

    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid user id', 400);
        const findUser = await this.userService.getUserById(id);
        if (!findUser) throw new HttpException('No user found', 404);
        return findUser;
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid user id', 400);
        const updatedUser = await this.userService.updateUser(id, updateUserDto);
        if (!updatedUser) throw new HttpException('No user found', 404);
        return updatedUser;
    }


    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid user id', 400);
        const deletedUser = await this.userService.deleteUser(id);
        if (!deletedUser) throw new HttpException('No user found', 404);
        return "User deleted successfully";
    }

}