import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"; // Import necessary decorators from the @nestjs/common library.
import { CreateUserDto, UpdateUserDto, UserListResponseDto, UserResponseDto } from "./dto/User.dto"; // Import DTOs for user operations.
import { UserService } from "./user.service"; // Import UserService to handle user-related operations.
import mongoose from "mongoose"; // Import mongoose for ObjectId validation.
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"; // Import Swagger decorators for API documentation.
import { JwtGuard } from "src/guards/jwt.guards"; // Import JwtGuard for JWT token validation.
import { Roles } from "src/decorators/roles.decorator";
import { RolesGuard } from "src/guards/roles.guards";
import { Role } from "src/enums/role.enum";

@ApiTags('users') // Tag the controller with 'users' for Swagger documentation.
@Controller('users') // Controller handling user-related endpoints.
export class UserController {
    constructor(private userService: UserService) { }

    @Post() // HTTP POST method to create a new user.
    @UseGuards(JwtGuard, RolesGuard) // Apply JwtGuard and RolesGuard to protect this endpoint.
    @Roles([Role.Admin]) // Apply the 'admin' role to this endpoint.    
    @UsePipes(new ValidationPipe()) // Apply ValidationPipe for input validation.
    @ApiCreatedResponse({ description: 'User created successfully.', type: UserResponseDto }) // Swagger response documentation.
    @ApiBadRequestResponse({ description: 'Invalid data provided.' }) // Swagger response documentation.
    @ApiBearerAuth() // Indicate that JWT token is required for this endpoint.
    createUser(@Body() createUserDto: CreateUserDto) {
        const newUser = this.userService.createUser(createUserDto);
        if (!newUser) throw new HttpException('User not created', 404); // Throw exception if user creation fails.
        return newUser;
    }

    @UseGuards(JwtGuard, RolesGuard) // Apply JwtGuard and RolesGuard to protect this endpoint.
    @Roles([Role.Admin, Role.Manager]) // Apply the 'admin' role to this endpoint.
    @Get() // HTTP GET method to retrieve all users.
    @ApiForbiddenResponse({ description: 'Forbidden.' }) // Swagger response documentation.
    @ApiOkResponse({ description: 'List of all users.', type: UserListResponseDto }) // Swagger response documentation.
    async getAllUsers(): Promise<UserListResponseDto> {
        const users = await this.userService.getAllUsers();
        if (!users) throw new HttpException('No users found', 404); // Throw exception if no users found.
        return users;
    }

    @UseGuards(JwtGuard, RolesGuard) // Apply JwtGuard and RolesGuard to protect this endpoint.
    @Roles([Role.Admin, Role.Manager]) // Apply the 'admin' role to this endpoint.
    @Get(':id') // HTTP GET method to retrieve a user by ID.
    @ApiOkResponse({ description: 'User found successfully.', type: UserResponseDto }) // Swagger response documentation.
    @ApiNotFoundResponse({ description: 'User not found.' }) // Swagger response documentation.
    async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid user id', 400); // Throw exception if invalid ObjectId provided.
        const findUser = await this.userService.getUserById(id);
        if (!findUser) throw new HttpException('No user found', 404); // Throw exception if user not found.
        return findUser;
    }

    @Patch(':id') // HTTP PATCH method to update a user by ID.
    @UseGuards(JwtGuard, RolesGuard) // Apply JwtGuard and RolesGuard to protect this endpoint.
    @Roles([Role.Admin]) // Apply the 'admin' role to this endpoint.
    @UsePipes(new ValidationPipe()) // Apply ValidationPipe for input validation.
    @ApiOkResponse({ description: 'User updated successfully.', type: UserResponseDto }) // Swagger response documentation.
    @ApiNotFoundResponse({ description: 'User not found.' }) // Swagger response documentation.
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid user id', 400); // Throw exception if invalid ObjectId provided.
        const updatedUser = await this.userService.updateUser(id, updateUserDto);
        if (!updatedUser) throw new HttpException('No user found', 404); // Throw exception if user not found.
        return updatedUser;
    }

    @Delete(':id') // HTTP DELETE method to delete a user by ID.
    @UseGuards(JwtGuard, RolesGuard) // Apply JwtGuard and RolesGuard to protect this endpoint.
    @Roles([Role.Admin]) // Apply the 'admin' role to this endpoint.
    @ApiOkResponse({ description: 'User deleted successfully.' }) // Swagger response documentation.
    @ApiNotFoundResponse({ description: 'User not found.' }) // Swagger response documentation.
    async deleteUser(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid user id', 400); // Throw exception if invalid ObjectId provided.
        const deletedUser = await this.userService.deleteUser(id);
        if (!deletedUser) throw new HttpException('No user found', 404); // Throw exception if user not found.
        return "User deleted successfully";
    }

}
