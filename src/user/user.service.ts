import { HttpException, HttpStatus, Injectable } from "@nestjs/common"; // Import the Injectable decorator from the @nestjs/common library.
import { InjectModel } from "@nestjs/mongoose"; // Import the InjectModel decorator from the @nestjs/mongoose library.
import { Model } from "mongoose"; // Import the Model type from the mongoose library.
import { User } from "src/schema/User.schema"; // Import the User schema from the schemas folder.
import { CreateUserDto, UpdateUserDto, UserListResponseDto, UserResponseDto } from "./dto/User.dto";
import { LoginDto } from "./dto/Auth.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
// The UserService class is a provider that is injected into the UsersModule.
@Injectable()
export class UserService {
    // The @InjectModel() decorator is used to inject the User model into the UserService class.
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ) { }
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = await this.userModel.findOne({ email: createUserDto.email });
        // If the user exists, throw an error.
        if (user) throw new HttpException('Email is already taken', HttpStatus.UNPROCESSABLE_ENTITY);
        //hash password and update the createUserDto
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(createUserDto.password, salt);
        createUserDto.password = hash;
        // The save() method is used to insert a new document into the User collection.
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async getAllUsers(): Promise<UserListResponseDto> {
        return { users: await this.userModel.find() };
    }

    async getUserById(id: string): Promise<UserResponseDto> {
        return await this.userModel.findById(id);
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const user = await this.userModel.findById(id);
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (bcrypt.compareSync(updateUserDto.password, user.password) === false) throw new HttpException('Password is incorrect', HttpStatus.UNPROCESSABLE_ENTITY);
        return await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    }

    async deleteUser(id: string) {
        const user = await this.userModel.findById(id);
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        return await this.userModel.findByIdAndDelete(id);
    }

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto);
        const payload = {
            username: user.username,
            sub: user._id,
        };

        return {
            user,
            backendTokens: {
                accessToken: await this.jwtService.signAsync(payload,
                    {
                        expiresIn: '1h',
                        secret: process.env.JWT_SECRET_KEY,
                    }),
                refreshToken: await this.jwtService.signAsync(payload,
                    {
                        expiresIn: '7d',
                        secret: process.env.JWT_REFRESH_TOKEN,
                    }),
            }
        };
    }
    async validateUser(dto: LoginDto) {
        const user = await this.userModel.findOne({ email: dto.email });
        if (user && (await bcrypt.compare(dto.password, user.password))) {
            const { password, ...result } = user;
            return result
        }
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    async refreshToken(user: any) {
        const payload = {
            username: user.username,
            sub: user.sub,
        };
        return {
            accessToken: await this.jwtService.signAsync(payload,
                {
                    expiresIn: '1h',
                    secret: process.env.JWT_SECRET_KEY,
                }),
            refreshToken: await this.jwtService.signAsync(payload,
                {
                    expiresIn: '7d',
                    secret: process.env.JWT_REFRESH_TOKEN,
                }),
        }
    }

}