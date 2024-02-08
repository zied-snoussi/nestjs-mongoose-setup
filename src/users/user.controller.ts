import { Body, Controller, Delete, Get, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto, UserListResponseDto, UserResponseDto } from "./dto/User.dto";
import { UserService } from "./users.service";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }
    @Post()
    @UsePipes(new ValidationPipe())
    createUser(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto);
        return this.userService.createUser(createUserDto);
    }

    @Get()
    async getAllUsers(): Promise<UserListResponseDto> {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    async getUserById(id: string): Promise<UserResponseDto> {
        return this.userService.getUserById(id);
    }

    @Post(':id')
    @UsePipes(new ValidationPipe())
    async updateUser(@Body() updateUserDto: UpdateUserDto, id: string): Promise<UserResponseDto> {
        return this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    async deleteUser(id: string) {
        return this.userService.deleteUser(id);
    }

    


}