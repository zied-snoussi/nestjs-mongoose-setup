import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UpdateUserDtoStub, UserDtoStub, UsersDtoSubResponse } from "../test/stubs/user.dto.stub";
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Role } from "../enums/role.enum";

describe("UserController", () => {
    let controller: UserController;
    let mockUserService; // Declare mockUserService variable outside beforeEach for wider scope

    beforeEach(async () => {
        // Define mock user service with Jest mock functions
        mockUserService = {
            createUser: jest.fn(dto => UserDtoStub),
            getAllUsers: jest.fn().mockResolvedValue(UsersDtoSubResponse),
            getUserById: jest.fn().mockResolvedValue(UserDtoStub),
            updateUser: jest.fn().mockImplementation((_id, dto) => "User updated successfully"),
            deleteUser: jest.fn().mockImplementation((_id)=> "User deleted successfully"),
        };

        // Create a testing module with mocked UserService
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({
                envFilePath: '.env.test.local', // Load environment variables from local file
            })],
            controllers: [UserController],
            providers: [JwtService, UserService], // Provide JwtService and real UserService
        })
            .overrideProvider(UserService) // Override the provider for the UserService
            .useValue(mockUserService) // Use the mockUserService instead of the real UserService
            .compile(); // Compile the module

        controller = module.get<UserController>(UserController); // Get instance of UserController from module
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear all Jest mocks after each test
    });

    it("should be defined", () => {
        expect(controller).toBeDefined(); // Check if controller is defined
    });


    it('should create a user', () => {
        expect(controller.createUser(UserDtoStub)).toEqual(UserDtoStub); // Check if createUser method returns correct value
        expect(mockUserService.createUser).toHaveBeenCalledWith(UserDtoStub); // Check if createUser method of mockUserService is called with correct arguments
    });

    it('should return a user', async () => {
        const _id = '60d0fe4a6e3a491b8a6e6d8d';
        const user = await controller.getUserById(_id); // Call getUserById method
        expect(user).toEqual(UserDtoStub); // Check if returned user matches expected user
        expect(mockUserService.getUserById).toHaveBeenCalledWith(_id); // Check if getUserById method of mockUserService is called with correct arguments
    });

    it('should return a list of users', async () => {
        const users = await controller.getAllUsers(); // Call getAllUsers method
        expect(users).toEqual(UsersDtoSubResponse); // Check if returned users match expected users
        expect(mockUserService.getAllUsers).toHaveBeenCalled(); // Check if getAllUsers method of mockUserService is called
    });

    it('should update a user', async () => {
        const _id = '60d0fe4a6e3a491b8a6e6d8d';
        const dto = { "first_name": "John", "last_name": "Doe","password": "password123", role: Role.Admin };
    
        // Await the updateUser method call
        const updatedUser = await controller.updateUser(_id, dto);
    
        // Assert the resolved value
        expect(updatedUser).toEqual("User updated successfully"); // Check if returned message matches expected message
        expect(mockUserService.updateUser).toHaveBeenCalledWith(_id, dto); // Check if updateUser method of mockUserService is called with correct arguments
    });


    it('should delete a user', async () => {
        const _id = '60d0fe4a6e3a491b8a6e6d8d';
        const deletedUser = await controller.deleteUser(_id); // Call deleteUser method
        expect(deletedUser).toEqual("User deleted successfully"); // Check if returned message matches expected message
        expect(mockUserService.deleteUser).toHaveBeenCalledWith(_id); // Check if deleteUser method of mockUserService is called with correct arguments
    });

});
