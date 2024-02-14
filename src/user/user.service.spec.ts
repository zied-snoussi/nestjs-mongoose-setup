import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserSchema, User } from '../schema/User.schema';
import { Model } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UpdateUserDtoStub, UserDtoStub, UsersDtoSubResponse } from '../test/stubs/user.dto.stub';
import { UserListResponseDto, UserResponseDto } from './dto/User.dto';

describe('UserService', () => {
    let service: UserService;
    let user: UserResponseDto | any;
    const mockUserModel = {
        createUser: jest.fn().mockImplementation((dto) => dto),
        saveUser: jest.fn().mockImplementation(user => user),
        getAllUsers: jest.fn().mockResolvedValue(UserListResponseDto),
        getUserById: jest.fn().mockImplementation((_id) => UserResponseDto),
        updateUser: jest.fn().mockImplementation((_id, dto) => UserResponseDto),
        deleteUser: jest.fn().mockImplementation((_id) => UserResponseDto),
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env.test.local', // Load environment variables from local file
                }),
                // Connect to MongoDB database using Mongoose
                MongooseModule.forRoot(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}`),
                // MongooseModule.forFeature() imports the User schema into the MongooseModule.
                MongooseModule.forFeature([
                    {
                        name: User.name, // Specify the name of the schema.
                        schema: UserSchema, // Specify the schema itself.
                    }
                ]),
            ],
            providers: [
                // Provide the UserService and UserModel dependencies
                UserService,
                {
                    provide: 'User', // Use the string 'User' to refer to the UserModel
                    useValue: Model, // Use the Mongoose Model class as the value for the UserModel
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService); // Get an instance of the UserService from the testing module
    });

    //after each test, clear all mocks and drop database collection
    afterAll(async () => {
        jest.clearAllMocks();
        await service.deleteCollection();
    });

    it('should be defined', () => {
        expect(service).toBeDefined(); // Check if the service is defined
    });

    it('should create a new user record and return the user', async () => {
        // Create a new user record
        user = await service.createUser(UserDtoStub);
        expect(user.email).toEqual(UserDtoStub.email);
    });

    it('should return all user records', async () => {
        const users = await service.getAllUsers();
        expect(users[0].email).toEqual(user.email);
    });

    it('should return a user record by id', async () => {
        const userFound = await service.getUserById(user._id);
        expect(userFound.email).toEqual(user.email);
    });

    it('should update a user record by id', async () => {
        const updatedUser = await service.updateUser(user._id, UpdateUserDtoStub);
        expect(updatedUser.first_name).toEqual(UpdateUserDtoStub.first_name);
    });

    it('should delete a user record by id', async () => {
        const deletedUser = await service.deleteUser(user._id);
        expect(deletedUser._id).toEqual(user._id);
    });

});
