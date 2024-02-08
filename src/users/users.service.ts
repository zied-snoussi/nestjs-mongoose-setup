import { Injectable } from "@nestjs/common"; // Import the Injectable decorator from the @nestjs/common library.
import { InjectModel } from "@nestjs/mongoose"; // Import the InjectModel decorator from the @nestjs/mongoose library.
import { Model } from "mongoose"; // Import the Model type from the mongoose library.
import { User } from "src/schemas/User.schema"; // Import the User schema from the schemas folder.
import { CreateUserDto, UpdateUserDto, UserListResponseDto, UserResponseDto } from "./dto/User.dto";

// The UserService class is a provider that is injected into the UsersModule.
@Injectable()
export class UserService {
    // The @InjectModel() decorator is used to inject the User model into the UserService class.
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    createUser(createUserDto: CreateUserDto) {
        const newUser = new this.userModel(createUserDto);
        return newUser.save();
    }

    async getAllUsers(): Promise<UserListResponseDto> {
        return { users: await this.userModel.find() };
    }

    async getUserById(id: string): Promise<UserResponseDto> {
        return await this.userModel.findById(id);
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        return await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    }

    async deleteUser(id: string) {
        return await this.userModel.findByIdAndDelete(id);
    }

}