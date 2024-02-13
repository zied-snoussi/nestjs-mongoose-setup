import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/User.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schema/User.schema';
import { JwtModule } from '@nestjs/jwt';

const users = [
  {
    _id: '1',
    first_name: 'John',
    last_name: 'Doe',
    username: 'johndoe',
    email: 'johndoe@example.com',
    role: 'admin',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    _id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    username: 'janesmith',
    email: 'janesmith@example.com',
    role: 'manager',
    created_at: new Date(),
    updated_at: new Date(),
  },
  // Add more mocked user objects as needed
];

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // MongooseModule.forFeature() imports the User schema into the MongooseModule.
        MongooseModule.forFeature([
            {
                name: User.name, // Specify the name of the schema.
                schema: UserSchema, // Specify the schema itself.
            }
        ]),
        // JwtModule.register() imports the JwtModule and configures it to use a global secret.
        JwtModule.register({
            global: true, // Set the module to be available globally.
            secret: process.env.JWT_SECRET_KEY, // Use the JWT secret key from environment variables.
        })
    ],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            getAllUsers: jest.fn(),
            getUserById: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: 'test',
        role: 'admin',
        email: 'test@example.com',
        first_name: 'test',
        last_name: 'test',
      };

      const createdUser = { ...createUserDto, _id: '3' };

      userService.createUser.prototype.mockResolvedValue(createdUser);

      const result = await controller.createUser(createUserDto);

      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });

    it('should throw error if user creation fails', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: 'test',
        role: 'admin',
        email: 'test@example.com',
        first_name: 'test',
        last_name: 'test',
      };

      userService.createUser.prototype.mockResolvedValue(null);

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        new HttpException('User not created', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return a list of users', async () => {
      userService.getAllUsers.prototype.mockResolvedValue(users);

      const result = await controller.getAllUsers();

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should throw error if no users found', async () => {
      userService.getAllUsers.prototype.mockResolvedValue([]);

      await expect(controller.getAllUsers()).rejects.toThrow(
        new HttpException('No users found', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const id = '1';
      const user = users[0];
      userService.getUserById.prototype.mockResolvedValue(user);

      const result = await controller.getUserById(id);

      expect(userService.getUserById).toHaveBeenCalledWith(id);
      expect(result).toEqual(user);
    });

    it('should throw error if user not found', async () => {
      const id = '1';
      userService.getUserById.prototype.mockResolvedValue(null);

      await expect(controller.getUserById(id)).rejects.toThrow(
        new HttpException('No user found', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user by id', async () => {
      const id = '1';
      const updateUserDto = {
        username: 'test',
        password: 'test',
        role: 'admin',
        email: 'test@example.com',
        first_name: 'test',
        last_name: 'test',
      };

      const updatedUser = { ...updateUserDto, _id: id };

      userService.updateUser.prototype.mockResolvedValue(updatedUser);

      const result = await controller.updateUser(id, updateUserDto);

      expect(userService.updateUser).toHaveBeenCalledWith(id, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw error if user not found', async () => {
      const id = '1';
      const updateUserDto = {
        username: 'test',
        password: 'test',
        role: 'admin',
        email: 'test@example.com',
        first_name: 'test',
        last_name: 'test',
      };

      userService.updateUser.prototype.mockResolvedValue(null);

      await expect(controller.updateUser(id, updateUserDto)).rejects.toThrow(
        new HttpException('No user found', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by id', async () => {
      const id = '1';

      userService.deleteUser.prototype.mockResolvedValue(true);

      const result = await controller.deleteUser(id);

      expect(userService.deleteUser).toHaveBeenCalledWith(id);
      expect(result).toEqual(true);
    });

    it('should throw error if user not found', async () => {
      const id = '1';

      userService.deleteUser.prototype.mockResolvedValue(false);

      await expect(controller.deleteUser(id)).rejects.toThrow(
        new HttpException('No user found', HttpStatus.NOT_FOUND)
      );
    });
  });
});
