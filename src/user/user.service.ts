import { HttpException, HttpStatus, Injectable } from "@nestjs/common"; // Import the Injectable decorator from the @nestjs/common library.
import { InjectModel } from "@nestjs/mongoose"; // Import the InjectModel decorator from the @nestjs/mongoose library.
import { Model } from "mongoose"; // Import the Model type from the mongoose library.
import { User } from "../schema/User.schema"; // Import the User schema from the schemas folder.
import { CreateUserDto, UpdateUserDto, UserListResponseDto, UserResponseDto } from "./dto/User.dto";
import * as bcrypt from 'bcrypt';

const generatePassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}


// The UserService class is a provider that is injected into the UsersModule.
@Injectable()
export class UserService {
    // The @InjectModel() decorator is used to inject the User model into the UserService class.
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) { }

    // Method to create a new user
    async createUser(createUserDto: CreateUserDto) {
        const user = await this.userModel.findOne({ email: createUserDto.email });
        if (user) throw new HttpException('Email is already taken', HttpStatus.UNPROCESSABLE_ENTITY);
        if (createUserDto.password === '' || createUserDto.password.length < 6) throw new HttpException('Password must be at least 6 characters long', HttpStatus.UNPROCESSABLE_ENTITY);
        createUserDto.password = generatePassword(createUserDto.password);
        const newUser = await (new this.userModel(createUserDto)).save();
        return newUser;
    }

    // Method to retrieve all users
    async getAllUsers() {
        const users = await this.userModel.find();
        if (!users) throw new HttpException('No users found', HttpStatus.NOT_FOUND);
        return users;
    }

    // Method to retrieve a user by ID
    async getUserById(id: string): Promise<UserResponseDto> {
        return await this.userModel.findById(id);
    }

    // Method to update a user
    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.userModel.findById(id);
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (updateUserDto.password) {
            if (await bcrypt.compare(updateUserDto.password, user.password)) {
                if (updateUserDto.newPassword !== undefined && updateUserDto.newPassword !== null) {
                    if (updateUserDto.newPassword === '' || updateUserDto.newPassword.length < 6) throw new HttpException('Password must be at least 6 characters long', HttpStatus.UNPROCESSABLE_ENTITY);
                    else {
                        const salt = bcrypt.genSaltSync(10);
                        const hash = bcrypt.hashSync(updateUserDto.newPassword, salt);
                        delete updateUserDto.newPassword;
                        updateUserDto.password = hash;
                    }
                } else {
                    delete updateUserDto.password;
                }
                // Update the user
                const userUpdated = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
               return userUpdated;
            } else {
                throw new HttpException('Password is incorrect', HttpStatus.UNAUTHORIZED);
            }
        }
    }

    // Method to delete a user
    async deleteUser(id: string) {
        const user = await this.userModel.findById(id);
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        return await this.userModel.findByIdAndDelete(id);
    }
    // Method to find a user by email
    async findUserByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({ email });
    }

    async deleteCollection(): Promise<any>{
        return await this.userModel.deleteMany({});
    }
}
